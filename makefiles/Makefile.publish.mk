###############################################################################
# Makefile.publish: Publishing spokes to GitHub and npm
#
# IMPORTANT: Always use 'pnpm publish' (not 'npm publish')
# - workspace:* protocol in package.json is pnpm-specific
# - pnpm publish auto-converts workspace:* to actual versions
# - npm publish fails with EUNSUPPORTEDPROTOCOL error
# See .github/copilot-instructions.md for details
###############################################################################
# Resolve this makefile's directory to allow absolute invocation
MAKEFILE_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(MAKEFILE_DIR)/Makefile.shared.mk
REPO_ROOT := $(abspath $(MAKEFILE_DIR)/..)

.PHONY: publish npm-publish npm-login npm-check npm-publish-all \
	publish-vscode publish-vscode-via-ci \
	version-patch version-minor version-major \
        publish-core publish-pattern-detect publish-skills \
        npm-publish-core npm-publish-pattern-detect npm-publish-skills \
        pull sync-from-spoke sync deploy push

# Default owner for GitHub repos
OWNER ?= caopengau
# Default branch name to push to
TARGET_BRANCH ?= main

# Validate SPOKE parameter is provided
define require_spoke
	@if [ -z "$(SPOKE)" ]; then \
		$(call log_error,SPOKE parameter required. Usage: make $@ SPOKE=pattern-detect); \
		exit 1; \
	fi; \
	if [ ! -d "$(REPO_ROOT)/packages/$(SPOKE)" ]; then \
		$(call log_error,Package packages/$(SPOKE) not found); \
		exit 1; \
	fi
endef

npm-check: ## Check npm login status
	@$(call log_step,Checking npm authentication...)
	@if ! npm whoami >/dev/null 2>&1; then \
		if [ "$(shell [ -n "$$CI" ] || [ -n "$$GITHUB_ACTIONS" ] && echo "true" || echo "false")" = "true" ]; then \
			$(call log_error,Not logged into npm in CI environment. Aborting.); \
			exit 1; \
		fi; \
		$(call log_error,Not logged into npm. Prompting for login...); \
		echo ""; \
		printf "Would you like to login now? (Y/n): "; \
		read response; \
		response=$${response:-Y}; \
		case $$response in \
			[Yy]|[Yy][Ee][Ss]) \
				$(MAKE) npm-login; \
				if npm whoami >/dev/null 2>&1; then \
					$(call log_success,Logged into npm as $$(npm whoami)); \
				else \
					$(call log_error,NPM login failed. Aborting release.); \
					exit 1; \
				fi \
				;; \
			*) \
				$(call log_error,NPM login required for publishing. Aborting release.); \
				exit 1 ;; \
		esac; \
	else \
		$(call log_success,Logged into npm as $$(npm whoami)); \
	fi

npm-login: ## Login to npm registry
	@$(call log_step,Logging into npm...)
	@npm login

# Generic version bumping (requires SPOKE parameter)
version-patch: ## Bump spoke patch version (0.1.0 -> 0.1.1). Usage: make version-patch SPOKE=pattern-detect
	$(call require_spoke)
	@$(call log_step,Bumping @aiready/$(SPOKE) patch version...)
# dangerous suppress errors because version does gets bumped
	@cd packages/$(SPOKE) && pnpm version patch --no-git-tag-version 2>/dev/null || true
	@$(call log_success,Version bumped to $$(cd packages/$(SPOKE) && node -p "require('./package.json').version"))

version-patch-vscode: ## Bump VS Code extension patch version
	@$(call log_step,Bumping VS Code extension patch version...)
	@cd vscode-extension && pnpm version patch --no-git-tag-version
	@$(call log_success,Version bumped to $$(cd vscode-extension && node -p "require('./package.json').version"))

version-patch-all: ## Bump all spokes patch version
	@for spoke in $(NPM_PUBLISH_SPOKES); do \
		$(MAKE) version-patch SPOKE=$$spoke; \
	done

version-minor: ## Bump spoke minor version (0.1.0 -> 0.2.0). Usage: make version-minor SPOKE=pattern-detect
	$(call require_spoke)
	@$(call log_step,Bumping @aiready/$(SPOKE) minor version...)
# dangerous suppress errors because version does gets bumped
	@cd packages/$(SPOKE) && pnpm version minor --no-git-tag-version 2>/dev/null || true
	@$(call log_success,Version bumped to $$(cd packages/$(SPOKE) && node -p "require('./package.json').version"))

version-major: ## Bump spoke major version (0.1.0 -> 1.0.0). Usage: make version-major SPOKE=pattern-detect
	$(call require_spoke)
	@$(call log_step,Bumping @aiready/$(SPOKE) major version...)
# dangerous suppress errors because version does gets bumped
	@cd packages/$(SPOKE) && pnpm version major --no-git-tag-version 2>/dev/null || true
	@$(call log_success,Version bumped to $$(cd packages/$(SPOKE) && node -p "require('./package.json').version"))

# Generic npm publish (requires SPOKE parameter)
npm-publish: npm-check ## Publish spoke to npm. Usage: make npm-publish SPOKE=pattern-detect
	$(call require_spoke)
	@$(call log_step,Publishing @aiready/$(SPOKE) to npm...)
	@if [ "$(SKIP_NPM)" = "1" ]; then \
		$(call log_info,SKIP_NPM=1 detected. Skipping npm publish for @aiready/$(SPOKE).); \
	else \
		cd packages/$(SPOKE) && pnpm publish --access public --no-git-checks || { \
			$(call log_error,Publish failed); \
			exit 1; \
		}; \
		$(call log_success,Published @aiready/$(SPOKE) to npm); \
	fi

# Generic GitHub publish (requires SPOKE parameter)
publish: ## Publish spoke to GitHub. Usage: make publish SPOKE=pattern-detect [OWNER=username]
	$(call require_spoke)
	@$(call log_step,Publishing @aiready/$(SPOKE) to GitHub...)
	@url="https://github.com/$(OWNER)/aiready-$(SPOKE).git"; \
	remote="aiready-$(SPOKE)"; \
	branch="publish-$(SPOKE)"; \
	git remote add "$$remote" "$$url" 2>/dev/null || git remote set-url "$$remote" "$$url"; \
	$(call log_info,Remote set: $$remote -> $$url); \
	git branch -D "$$branch" >/dev/null 2>&1 || true; \
	$(call log_info,Creating subtree split for packages/$(SPOKE)...); \
	git subtree split --prefix=packages/$(SPOKE) -b "$$branch" >/dev/null; \
	$(call log_info,Subtree split complete: $$branch); \
	split_commit=$$(git rev-parse "$$branch"); \
	git push -f "$$remote" "$$branch":$(TARGET_BRANCH); \
	$(call log_success,Synced @aiready/$(SPOKE) to GitHub spoke repo ($(TARGET_BRANCH))); \
	version=$$(node -p "require('./packages/$(SPOKE)/package.json').version"); \
	spoke_tag="v$$version"; \
	$(call log_step,Tagging spoke repo commit $$split_commit as $$spoke_tag...); \
	if git ls-remote --tags "$$remote" "$$spoke_tag" | grep -q "$$spoke_tag"; then \
		$(call log_info,Spoke tag $$spoke_tag already exists on $$remote; skipping); \
	else \
		git tag -a "$$spoke_tag" "$$split_commit" -m "Release @aiready/$(SPOKE) $$version"; \
		git push "$$remote" "$$spoke_tag"; \
		$(call log_success,Spoke tag pushed: $$spoke_tag); \
	fi

# Convenience aliases for specific spokes
publish-core: ## Publish @aiready/core to GitHub (shortcut for: make publish SPOKE=core)
	@$(MAKE) publish SPOKE=core OWNER=$(OWNER)

publish-paks: ## Publish agent skills to Playbooks.com (Paks registry)
	@$(call log_step,Publishing agent skills to Playbooks.com...)
	@if [ -f packages/skills/.env ]; then \
		export $$(grep -v '^#' packages/skills/.env | xargs); \
	fi; \
	if ! command -v paks >/dev/null 2>&1; then \
		$(call log_error,Paks CLI not found. Install with: npm install -g paks); \
		exit 1; \
	fi; \
	if [ -n "$$PAKS_TOKEN" ]; then \
		paks login --token $$PAKS_TOKEN --non-interactive 2>/dev/null || paks login --token $$PAKS_TOKEN; \
	fi; \
	$(MAKE) publish SPOKE=skills OWNER=$(OWNER); \
	version=$$(node -p "require('./packages/skills/package.json').version"); \
	tag="$$version"; \
	url="https://github.com/$(OWNER)/aiready-skills.git"; \
	remote="aiready-skills"; \
	git remote add "$$remote" "$$url" 2>/dev/null || git remote set-url "$$remote" "$$url"; \
	$(call log_info,Tagging public repo with $$version...); \
	git tag -f $$version; \
	git push -f "$$remote" $$version; \
	cd packages/skills && paks publish aiready-best-practices --tag $$version --yes || { \
		$(call log_error,Paks publish failed); \
		exit 1; \
	}
	@$(call log_success,Published skills to Playbooks.com using tag $$version)

publish-pattern-detect: ## Publish @aiready/pattern-detect to GitHub (shortcut for: make publish SPOKE=pattern-detect)
	@$(MAKE) publish SPOKE=pattern-detect OWNER=$(OWNER)

publish-context-analyzer: ## Publish @aiready/context-analyzer to GitHub (shortcut for: make publish SPOKE=context-analyzer)
	@$(MAKE) publish SPOKE=context-analyzer OWNER=$(OWNER)

publish-cli: ## Publish @aiready/cli to GitHub (shortcut for: make publish SPOKE=cli)
	@$(MAKE) publish SPOKE=cli OWNER=$(OWNER)

publish-skills: ## Publish @aiready/skills to GitHub (shortcut for: make publish SPOKE=skills)
	@$(MAKE) publish SPOKE=skills OWNER=$(OWNER)

publish-mcp-server: ## Publish @aiready/mcp-server to GitHub
	@$(MAKE) publish SPOKE=mcp-server OWNER=$(OWNER)

publish-contract-enforcement: ## Publish @aiready/contract-enforcement to GitHub
	@$(MAKE) publish SPOKE=contract-enforcement OWNER=$(OWNER)

npm-publish-core: ## Publish @aiready/core to npm (shortcut for: make npm-publish SPOKE=core)
	@$(MAKE) npm-publish SPOKE=core OTP=$(OTP)

npm-publish-pattern-detect: ## Publish @aiready/pattern-detect to npm (shortcut for: make npm-publish SPOKE=pattern-detect)
	@$(MAKE) npm-publish SPOKE=pattern-detect OTP=$(OTP)

npm-publish-context-analyzer: ## Publish @aiready/context-analyzer to npm (shortcut for: make npm-publish SPOKE=context-analyzer)
	@$(MAKE) npm-publish SPOKE=context-analyzer OTP=$(OTP)

npm-publish-cli: ## Publish @aiready/cli to npm (shortcut for: make npm-publish SPOKE=cli)
	@$(MAKE) npm-publish SPOKE=cli OTP=$(OTP)

npm-publish-consistency: ## Publish @aiready/consistency to npm
	@$(MAKE) npm-publish SPOKE=consistency OTP=$(OTP)

npm-publish-doc-drift: ## Publish @aiready/doc-drift to npm
	@$(MAKE) npm-publish SPOKE=doc-drift OTP=$(OTP)

npm-publish-deps: ## Publish @aiready/deps to npm
	@$(MAKE) npm-publish SPOKE=deps OTP=$(OTP)



npm-publish-testability: ## Publish @aiready/testability to npm
	@$(MAKE) npm-publish SPOKE=testability OTP=$(OTP)

npm-publish-agent-grounding: ## Publish @aiready/agent-grounding to npm
	@$(MAKE) npm-publish SPOKE=agent-grounding OTP=$(OTP)

npm-publish-ai-signal-clarity: ## Publish @aiready/ai-signal-clarity to npm
	@$(MAKE) npm-publish SPOKE=ai-signal-clarity OTP=$(OTP)

npm-publish-change-amplification: ## Publish @aiready/change-amplification to npm
	@$(MAKE) npm-publish SPOKE=change-amplification OTP=$(OTP)

npm-publish-contract-enforcement: ## Publish @aiready/contract-enforcement to npm
	@$(MAKE) npm-publish SPOKE=contract-enforcement OTP=$(OTP)

npm-publish-visualizer: ## Publish @aiready/visualizer to npm
	@$(MAKE) npm-publish SPOKE=visualizer OTP=$(OTP)

# Note: skills is NOT published to npm, only via skills.sh (GitHub)

npm-publish-all: build npm-publish-core npm-publish-pattern-detect npm-publish-context-analyzer npm-publish-cli \
	npm-publish-consistency npm-publish-doc-drift npm-publish-deps \
	npm-publish-testability npm-publish-agent-grounding npm-publish-visualizer \
	npm-publish-ai-signal-clarity npm-publish-change-amplification npm-publish-contract-enforcement

# Sync changes from spoke repos back to monorepo (for external contributions)
sync-from-spoke: ## Sync changes from spoke repo back to monorepo. Usage: make sync-from-spoke SPOKE=pattern-detect
	$(call require_spoke)
	@$(call log_step,Syncing changes from aiready-$(SPOKE) back to monorepo...)
	@url="https://github.com/$(OWNER)/aiready-$(SPOKE).git"; \
	remote="aiready-$(SPOKE)"; \
	git remote add "$$remote" "$$url" 2>/dev/null || git remote set-url "$$remote" "$$url"; \
	$(call log_info,Fetching latest from $$remote...); \
	git fetch "$$remote" $(TARGET_BRANCH); \
	$(call log_info,Pulling changes into packages/$(SPOKE)...); \
	git subtree pull --prefix=packages/$(SPOKE) "$$remote" $(TARGET_BRANCH) --squash -m "chore: sync $(SPOKE) from public repo"; \
	$(call log_success,Synced changes from aiready-$(SPOKE))

pull: ## Alias for sync-from-spoke. Usage: make pull SPOKE=pattern-detect
	@$(MAKE) sync-from-spoke SPOKE=$(SPOKE)

push: sync ## Alias for sync
push-all: sync ## Alias for sync (push monorepo + publish all spokes)

# Sync changes from platform repo back to monorepo
sync-platform: ## Sync changes from aiready-platform back to monorepo
	@$(call log_step,Syncing changes from aiready-platform back to monorepo...)
	@url="https://github.com/$(OWNER)/aiready-platform.git"; \
	remote="aiready-platform"; \
	branch="main"; \
	git remote add "$$remote" "$$url" 2>/dev/null || git remote set-url "$$remote" "$$url"; \
	$(call log_info,Fetching latest from $$remote...); \
	git fetch "$$remote" "$$branch"; \
	$(call log_info,Pulling changes into platform/ directory...); \
	git subtree pull --prefix=platform "$$remote" "$$branch" --squash -m "chore: sync platform from private repo"; \
	$(call log_success,Synced changes from aiready-platform)

publish-platform: ## Publish platform to GitHub. Usage: make publish-platform [OWNER=username]
	@$(call log_step,Publishing platform to GitHub...)
	@url="https://github.com/$(OWNER)/aiready-platform.git"; \
	remote="aiready-platform"; \
	branch="publish-platform"; \
	target_branch="main"; \
	platform_version=$$(node -p "require('$(REPO_ROOT)/platform/package.json').version" 2>/dev/null || echo "0.1.0"); \
	git remote add "$$remote" "$$url" 2>/dev/null || git remote set-url "$$remote" "$$url"; \
	$(call log_info,Remote set: $$remote -> $$url); \
	git branch -D "$$branch" >/dev/null 2>&1 || true; \
	$(call log_info,Creating subtree split for platform...); \
	git subtree split --prefix=platform -b "$$branch" >/dev/null; \
	$(call log_info,Removing sensitive files from split branch...); \
	git checkout "$$branch" 2>/dev/null; \
	if [ -f .env ]; then git rm -f .env >/dev/null 2>&1; fi; \
	if [ -f .env.local ]; then git rm -f .env.local >/dev/null 2>&1; fi; \
	if ! git diff --cached --quiet 2>/dev/null; then \
		git commit -m "chore: remove sensitive files for private repo" >/dev/null 2>&1; \
	fi; \
	git checkout $(TARGET_BRANCH) 2>/dev/null; \
	$(call log_info,Subtree split complete: $$branch); \
	split_commit=$$(git rev-parse "$$branch"); \
	git push -f "$$remote" "$$branch:$$target_branch"; \
	$(call log_success,Synced platform to GitHub repo ($$target_branch)); \
	platform_tag="v$$platform_version"; \
	git tag -f "$$platform_tag" "$$split_commit" -m "Release platform v$$platform_version" 2>/dev/null || true; \
	git push -f "$$remote" "$$platform_tag"; \
	$(call log_success,Platform tag pushed: $$platform_tag)

# Sync changes from landing repo back to monorepo
sync-landing: ## Sync changes from aiready-landing back to monorepo
	@$(call log_step,Syncing changes from aiready-landing back to monorepo...)
	@url="https://github.com/$(OWNER)/aiready-landing.git"; \
	remote="aiready-landing"; \
	branch="main"; \
	git remote add "$$remote" "$$url" 2>/dev/null || git remote set-url "$$remote" "$$url"; \
	$(call log_info,Fetching latest from $$remote...); \
	git fetch "$$remote" "$$branch"; \
	$(call log_info,Pulling changes into landing/ directory...); \
	git subtree pull --prefix=landing "$$remote" "$$branch" --squash -m "chore: sync landing page from public repo"; \
	$(call log_success,Synced changes from aiready-landing)

publish-landing: ## Publish landing page to GitHub. Usage: make publish-landing [OWNER=username]
	@$(call log_step,Publishing landing page to GitHub...)
	@url="https://github.com/$(OWNER)/aiready-landing.git"; \
	remote="aiready-landing"; \
	branch="publish-landing"; \
	target_branch="main"; \
	landing_version=$$(node -p "require('$(REPO_ROOT)/landing/package.json').version" 2>/dev/null || echo "0.0.0"); \
	git remote add "$$remote" "$$url" 2>/dev/null || git remote set-url "$$remote" "$$url"; \
	$(call log_info,Remote set: $$remote -> $$url); \
	git branch -D "$$branch" >/dev/null 2>&1 || true; \
	$(call log_info,Creating subtree split excluding sst.config.ts and .env...); \
	git subtree split --prefix=landing -b "$$branch" >/dev/null; \
	$(call log_info,Removing sensitive files from split branch...); \
	git checkout "$$branch" 2>/dev/null; \
	if [ -f sst.config.ts ]; then git rm -f sst.config.ts >/dev/null 2>&1; fi; \
	if [ -f .env ]; then git rm -f .env >/dev/null 2>&1; fi; \
	if ! git diff --cached --quiet 2>/dev/null; then \
		git commit -m "chore: remove sensitive files for public repo" >/dev/null 2>&1; \
	fi; \
	git checkout $(TARGET_BRANCH) 2>/dev/null; \
	$(call log_info,Subtree split complete: $$branch); \
	split_commit=$$(git rev-parse "$$branch"); \
	git push -f "$$remote" "$$branch:$$target_branch"; \
	$(call log_success,Synced landing page to GitHub repo ($$target_branch)); \
	$(call log_step,Tagging landing repo commit with v$$landing_version...); \
	landing_tag="v$$landing_version"; \
	git tag -f "$$landing_tag" "$$split_commit" -m "Release landing v$$landing_version" 2>/dev/null || true; \
	git push -f "$$remote" "$$landing_tag"; \
	$(call log_success,Landing tag pushed: $$landing_tag)

# Sync changes from clawmore repo back to monorepo
sync-clawmore: ## Sync changes from aiready-clawmore back to monorepo
	@$(call log_step,Syncing changes from aiready-clawmore back to monorepo...)
	@url="https://github.com/$(OWNER)/aiready-clawmore.git"; \
	remote="aiready-clawmore"; \
	branch="main"; \
	git remote add "$$remote" "$$url" 2>/dev/null || git remote set-url "$$remote" "$$url"; \
	$(call log_info,Fetching latest from $$remote...); \
	git fetch "$$remote" "$$branch"; \
	$(call log_info,Pulling changes into clawmore/ directory...); \
	git subtree pull --prefix=clawmore "$$remote" "$$branch" --squash -m "chore: sync clawmore from standalone repo"; \
	$(call log_success,Synced changes from aiready-clawmore)


publish-clawmore: ## Publish clawmore to GitHub. Usage: make publish-clawmore [OWNER=username]
	@$(call log_step,Publishing clawmore to GitHub...)
	@url="https://github.com/$(OWNER)/aiready-clawmore.git"; \
	remote="aiready-clawmore"; \
	branch="publish-clawmore"; \
	target_branch="main"; \
	clawmore_version=$$(node -p "require('$(REPO_ROOT)/clawmore/package.json').version" 2>/dev/null || echo "0.1.0"); \
	git remote add "$$remote" "$$url" 2>/dev/null || git remote set-url "$$remote" "$$url"; \
	$(call log_info,Remote set: $$remote -> $$url); \
	git branch -D "$$branch" >/dev/null 2>&1 || true; \
	$(call log_info,Creating subtree split for clawmore...); \
	git subtree split --prefix=clawmore -b "$$branch" >/dev/null; \
	$(call log_info,Subtree split complete: $$branch); \
	split_commit=$$(git rev-parse "$$branch"); \
	git push -f "$$remote" "$$branch:$$target_branch"; \
	$(call log_success,Synced clawmore to GitHub repo ($$target_branch)); \
	clawmore_tag="v$$clawmore_version"; \
	git tag -f "$$clawmore_tag" "$$split_commit" -m "Release clawmore v$$clawmore_version" 2>/dev/null || true; \
	git push -f "$$remote" "$$clawmore_tag"; \
	$(call log_success,ClawMore tag pushed: $$clawmore_tag)

# Push to monorepo and all spoke repos
sync: ## Push monorepo to origin and sync all spokes to their public repos. Use FORCE=true to sync all.
	@$(call log_step,Pushing to monorepo...)
	@SKIP_PRE_PUSH=true git push origin $(TARGET_BRANCH)
	@$(call log_success,Pushed to monorepo)
	@$(call log_step,Detecting changes to sync...)
	@if [ "$(FORCE)" = "true" ]; then \
		CHANGED="FORCE_ALL"; \
		$(call log_info,Force sync enabled. All repositories will be synced.); \
	else \
		CHANGED="$$(git diff --name-only origin/$(TARGET_BRANCH) 2>/dev/null | xargs || echo "FORCE_ALL")"; \
		if [ "$$CHANGED" = "FORCE_ALL" ]; then \
			$(call log_warning,Could not detect changes reliably. Falling back to full sync.); \
		elif [ -z "$$CHANGED" ]; then \
			$(call log_info,No changes detected since last push to origin/$(TARGET_BRANCH).); \
			echo "To force sync, use 'make sync FORCE=true'"; \
		else \
			$(call log_info,Detected changes:); \
			echo "$$CHANGED" | sed 's/^/  - /'; \
		fi; \
	fi && \
	$(call log_step,Syncing relevant repositories in parallel...) && \
	SKIP_PRE_PUSH=true $(MAKE) $(MAKE_PARALLEL) $(addprefix github-sync-spoke-,$(PUBLIC_GITHUB_SPOKES)) github-sync-landing github-sync-platform github-sync-clawmore github-sync-vscode github-sync-action CHANGED_FILES="$$CHANGED" FORCE="$(FORCE)" && \
	$(call log_success,Sync process completed)

.PHONY: github-sync-spoke-%
github-sync-spoke-%:
	@if [ -f "$(REPO_ROOT)/packages/$*/package.json" ]; then \
		should_sync=false; \
		if [ "$(FORCE)" = "true" ] || [ "$(CHANGED_FILES)" = "FORCE_ALL" ] || echo "$(CHANGED_FILES)" | grep -q "packages/$*/"; then \
			should_sync=true; \
		fi; \
		if [ "$$should_sync" = "true" ]; then \
			$(call log_info,Syncing $*...); \
			$(MAKE) publish SPOKE=$* OWNER=$(OWNER) 2>&1 | grep -E '(SUCCESS|ERROR|Synced|tag pushed)'; \
		fi; \
	fi

.PHONY: github-sync-landing
github-sync-landing:
	@should_sync=false; \
	if [ "$(FORCE)" = "true" ] || [ "$(CHANGED_FILES)" = "FORCE_ALL" ] || echo "$(CHANGED_FILES)" | grep -q "landing/"; then \
		should_sync=true; \
	fi; \
	if [ "$$should_sync" = "true" ]; then \
		$(call log_step,Syncing landing page repository...); \
		$(MAKE) publish-landing OWNER=$(OWNER) 2>&1 | grep -E '(SUCCESS|ERROR|Synced|tag pushed)'; \
	fi

.PHONY: github-sync-platform
github-sync-platform:
	@should_sync=false; \
	if [ "$(FORCE)" = "true" ] || [ "$(CHANGED_FILES)" = "FORCE_ALL" ] || echo "$(CHANGED_FILES)" | grep -q "platform/"; then \
		should_sync=true; \
	fi; \
	if [ "$$should_sync" = "true" ]; then \
		$(call log_step,Syncing platform repository...); \
		$(MAKE) publish-platform OWNER=$(OWNER) 2>&1 | grep -E '(SUCCESS|ERROR|Synced|tag pushed)'; \
	fi

.PHONY: github-sync-clawmore
github-sync-clawmore:
	@should_sync=false; \
	if [ "$(FORCE)" = "true" ] || [ "$(CHANGED_FILES)" = "FORCE_ALL" ] || echo "$(CHANGED_FILES)" | grep -q "clawmore/"; then \
		should_sync=true; \
	fi; \
	if [ "$$should_sync" = "true" ]; then \
		$(call log_step,Syncing ClawMore repository...); \
		$(MAKE) publish-clawmore OWNER=$(OWNER) 2>&1 | grep -E '(SUCCESS|ERROR|Synced|tag pushed)'; \
	fi


.PHONY: github-sync-vscode
github-sync-vscode:
	@should_sync=false; \
	if [ "$(FORCE)" = "true" ] || [ "$(CHANGED_FILES)" = "FORCE_ALL" ] || echo "$(CHANGED_FILES)" | grep -q "vscode-extension/"; then \
		should_sync=true; \
	fi; \
	if [ "$$should_sync" = "true" ]; then \
		$(call log_step,Syncing VS Code extension repository...); \
		$(MAKE) publish-vscode-sync OWNER=$(OWNER) 2>&1 | grep -E '(SUCCESS|ERROR|Synced|tag pushed)'; \
	fi

.PHONY: github-sync-action
github-sync-action:
	@should_sync=false; \
	if [ "$(FORCE)" = "true" ] || [ "$(CHANGED_FILES)" = "FORCE_ALL" ] || echo "$(CHANGED_FILES)" | grep -q "action-marketplace/"; then \
		should_sync=true; \
	fi; \
	if [ "$$should_sync" = "true" ]; then \
		$(call log_step,Syncing GitHub Action repository...); \
		$(MAKE) publish-action-sync OWNER=$(OWNER) 2>&1 | grep -E '(SUCCESS|ERROR|Synced|tag pushed)'; \
	fi



publish-vscode-sync: ## Sync VS Code extension to GitHub. Usage: make publish-vscode-sync [OWNER=username]
	@$(call log_step,Publishing VS Code extension to GitHub...)
	@url="https://github.com/$(OWNER)/aiready-vscode.git"; \
	remote="aiready-vscode"; \
	branch="publish-vscode"; \
	git remote add "$$remote" "$$url" 2>/dev/null || git remote set-url "$$remote" "$$url"; \
	$(call log_info,Remote set: $$remote -> $$url); \
	git branch -D "$$branch" >/dev/null 2>&1 || true; \
	$(call log_info,Creating subtree split for vscode-extension...); \
	git subtree split --prefix=vscode-extension -b "$$branch" >/dev/null; \
	$(call log_info,Subtree split complete: $$branch); \
	split_commit=$$(git rev-parse "$$branch"); \
	git push -f "$$remote" "$$branch":$(TARGET_BRANCH); \
	$(call log_success,Synced VS Code extension to GitHub spoke repo ($(TARGET_BRANCH))); \
	version=$$(node -p "require('./vscode-extension/package.json').version"); \
	spoke_tag="v$$version"; \
	$(call log_step,Tagging spoke repo commit $$split_commit as $$spoke_tag...); \
	if git ls-remote --tags "$$remote" "$$spoke_tag" | grep -q "$$spoke_tag"; then \
		$(call log_info,Spoke tag $$spoke_tag already exists on $$remote; skipping); \
	else \
		git tag -a "$$spoke_tag" "$$split_commit" -m "Release VS Code extension $$version"; \
		git push "$$remote" "$$spoke_tag"; \
		$(call log_success,Spoke tag pushed: $$spoke_tag); \
	fi

publish-action-sync: ## Sync GitHub Action to standalone repo. Usage: make publish-action-sync [OWNER=username]
	@$(call log_step,Publishing GitHub Action to standalone repo...)
	@url="https://github.com/$(OWNER)/aiready-action.git"; \
	remote="aiready-action"; \
	branch="publish-action"; \
	git remote add "$$remote" "$$url" 2>/dev/null || git remote set-url "$$remote" "$$url"; \
	$(call log_info,Remote set: $$remote -> $$url); \
	git branch -D "$$branch" >/dev/null 2>&1 || true; \
	$(call log_info,Creating subtree split for action-marketplace...); \
	git subtree split --prefix=action-marketplace -b "$$branch" >/dev/null; \
	$(call log_info,Subtree split complete: $$branch); \
	split_commit=$$(git rev-parse "$$branch"); \
	git push -f "$$remote" "$$branch":$(TARGET_BRANCH); \
	$(call log_success,Synced GitHub Action to standalone repo ($(TARGET_BRANCH))); \
	version=$$(node -p "require('./action-marketplace/package.json').version"); \
	spoke_tag="v$$version"; \
	$(call log_step,Tagging action repo commit $$split_commit as $$spoke_tag...); \
	if git ls-remote --tags "$$remote" "$$spoke_tag" | grep -q "$$spoke_tag"; then \
		$(call log_info,Action tag $$spoke_tag already exists on $$remote; skipping); \
	else \
		git tag -a "$$spoke_tag" "$$split_commit" -m "Release GitHub Action $$version"; \
		git push "$$remote" "$$spoke_tag"; \
		$(call log_success,Action tag pushed: $$spoke_tag); \
	fi

# ============================================================================
# MCP Server Publishing
# ============================================================================

publish-mcp-smithery: ## Publish MCP Server to Smithery (requires SMITHERY_API_KEY in packages/mcp-server/.env.smithery)
	@$(call log_step,Publishing MCP Server to Smithery...); \
	if [ -f packages/mcp-server/.env.smithery ]; then \
		echo "[INFO] Loading SMITHERY_API_KEY from packages/mcp-server/.env.smithery"; \
		set a; . packages/mcp-server/.env.smithery; set +a; \
	fi; \
	if [ -z "$$SMITHERY_API_KEY" ]; then \
		echo "[ERROR] SMITHERY_API_KEY not set. Add it to packages/mcp-server/.env.smithery"; \
		exit 1; \
	fi; \
	echo "[INFO] Note: Smithery CLI v4+ defaults to hosted 'shttp' deployment which requires a paid plan."; \
	echo "[INFO] For open-source projects, the registry supports adding the GitHub URL directly via the web UI."; \
	echo "[INFO] Please navigate to https://smithery.ai/new or https://smithery.ai/submit"; \
	echo "[INFO] and provide the GitHub repository URL: https://github.com/$(OWNER)/aiready"; \
	echo "[INFO] Smithery will automatically read the smithery.yaml configuration."; \
	$(call log_success,MCP Server registry submission guidelines provided.)

publish-skill-smithery: ## Publish a specific skill to Smithery (Usage: make publish-skill-smithery SKILL=aiready-best-practices)
	@if [ -z "$(SKILL)" ]; then \
		$(call log_error,SKILL parameter required. Usage: make publish-skill-smithery SKILL=name); \
		exit 1; \
	fi; \
	if [ ! -d "packages/skills/$(SKILL)" ]; then \
		$(call log_error,Skill packages/skills/$(SKILL) not found); \
		exit 1; \
	fi; \
	$(call log_step,Publishing skill '$(SKILL)' to GitHub for Smithery...); \
	url="https://github.com/$(OWNER)/$(SKILL).git"; \
	remote="$(SKILL)"; \
	branch="publish-skill-$(SKILL)"; \
	git remote add "$$remote" "$$url" 2>/dev/null || git remote set-url "$$remote" "$$url"; \
	$(call log_info,Remote set: $$remote -> $$url); \
	git branch -D "$$branch" >/dev/null 2>&1 || true; \
	$(call log_info,Creating subtree split for packages/skills/$(SKILL)...); \
	git subtree split --prefix=packages/skills/$(SKILL) -b "$$branch" >/dev/null; \
	$(call log_info,Subtree split complete: $$branch); \
	git push -f "$$remote" "$$branch":main; \
	$(call log_success,Synced skill '$(SKILL)' to GitHub repo (main)); \
	echo ""; \
	echo "[INFO] Skill is now available at: $$url"; \
	echo "[INFO] To list on Smithery.ai:"; \
	echo "[INFO] 1. Navigate to https://smithery.ai/new"; \
	echo "[INFO] 2. Select 'Skill' as the submission type"; \
	echo "[INFO] 3. Provide the GitHub repository URL: $$url"; \
	$(call log_success,Skill repository prepared for Smithery submission.)

# ============================================================================
# VS Code Extension Publishing
# ============================================================================


publish-vscode: ## Publish VS Code extension to Marketplace (requires VSCE_PAT env var)
	@$(call log_step,Publishing VS Code extension...); \
	if [ -f vscode-extension/.env ]; then \
		echo "[INFO] Loading VSCE_PAT and OVSX_PAT from vscode-extension/.env"; \
		set a; . vscode-extension/.env; set +a; \
	fi; \
	if [ -z "$$VSCE_PAT" ]; then \
		echo "[ERROR] VSCE_PAT not set. Add it to vscode-extension/.env or export VSCE_PAT=your_token"; \
		exit 1; \
	fi; \
	cd vscode-extension && \
	echo "[INFO] Bumping version..." && \
	npm version $(if $(TYPE),$(TYPE),patch) --no-git-tag-version --workspaces-update=false && \
	pnpm run compile && \
	echo "[INFO] Publishing to VS Code Marketplace..." && \
	VSCE_PAT="$$VSCE_PAT" npx @vscode/vsce publish --no-dependencies --allow-star-activation && \
	if [ -n "$$OVSX_PAT" ]; then \
		echo "[INFO] Publishing to Open VSX Registry..." && \
		OVSX_PAT="$$OVSX_PAT" npx ovsx publish --no-dependencies; \
	else \
		echo "[WARN] OVSX_PAT not set. Skipping Open VSX compilation."; \
	fi; \
	$(call log_success,VS Code extension published)

