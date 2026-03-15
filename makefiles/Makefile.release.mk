###############################################################################
# Makefile.release: Release orchestrator for all distributable components
#
# npm spokes:  make release-one SPOKE=pattern-detect TYPE=minor
#              make release-all TYPE=minor
# ClawMore:    make release-clawmore-dev TYPE=patch / release-clawmore-prod TYPE=patch
# Landing:     make release-landing-dev TYPE=minor  / release-landing-prod TYPE=minor
# Platform:    make release-platform TYPE=patch
# VS Code:     make release-vscode TYPE=patch
# Status:      make release-status
###############################################################################

MAKEFILE_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
ROOT_DIR     := $(abspath $(MAKEFILE_DIR)/..)
include $(MAKEFILE_DIR)/Makefile.shared.mk
include $(MAKEFILE_DIR)/Makefile.publish.mk

OWNER         ?= caopengau
TARGET_BRANCH ?= main
LANDING_DIR   := $(ROOT_DIR)/landing
PLATFORM_DIR  := $(ROOT_DIR)/platform
CLAWMORE_DIR  := $(ROOT_DIR)/clawmore

.PHONY: check-changes check-dependency-updates release-one release-all release-dev release-status \
	release-landing release-landing-dev release-landing-prod \
	release-platform release-vscode \
	release-clawmore release-clawmore-dev release-clawmore-prod \
	release-spoke-% release-help \
	$(foreach t,patch minor major, \
		version-landing-$(t) version-platform-$(t) version-vscode-$(t) version-clawmore-$(t))

###############################################################################
# Internal macros
###############################################################################

# Resolve bump target name from TYPE (Make-level: returns version-patch|minor|major)
define bump_target_for_type
$(if $(filter $(1),patch),version-patch,$(if $(filter $(1),minor),version-minor,$(if $(filter $(1),major),version-major,)))
endef

# TYPE validation (shell-level). Use as: @$(validate_type)
define validate_type
	if [ -z "$(TYPE)" ]; then \
		$(call log_error,TYPE required: make $@ TYPE=patch|minor|major); \
		exit 1; \
	fi; \
	if [ "$(TYPE)" != "patch" ] && [ "$(TYPE)" != "minor" ] && [ "$(TYPE)" != "major" ]; then \
		$(call log_error,Invalid TYPE '$(TYPE)'. Expected patch|minor|major); \
		exit 1; \
	fi
endef

# Commit package.json + create annotated tag for any non-spoke app.
# $(1)=abs dir  $(2)=git-relative dir  $(3)=display name  $(4)=tag prefix
define commit_and_tag_app
	version=$$(node -p "require('$(1)/package.json').version"); \
	$(call log_step,Committing $(3) v$$version...); \
	cd $(ROOT_DIR) && git add $(2)/package.json; \
	cd $(ROOT_DIR) && git commit -m "chore(release): $(3) v$$version"; \
	tag_name="$(4)-v$$version"; \
	$(call log_step,Tagging $$tag_name...); \
	cd $(ROOT_DIR) && git tag -a "$$tag_name" -m "Release $(3) v$$version"; \
	$(call log_success,Committed and tagged $$tag_name)
endef

# Force-create a dev tag (no commit).  $(1)=abs dir  $(2)=tag prefix  $(3)=display name
define tag_dev_release
	version=$$(node -p "require('$(1)/package.json').version"); \
	$(call log_step,Tagging $(3) dev release $$version...); \
	cd $(ROOT_DIR) && git tag -f -a "$(2)-dev-v$$version" -m "Dev release $(3) v$$version"; \
	$(call log_success,Tagged $(2)-dev-v$$version)
endef

# Commit + tag for an npm spoke (uses Make var SPOKE, not call args)
define commit_and_tag
	version=$$(node -p "require('$(ROOT_DIR)/packages/$(SPOKE)/package.json').version"); \
	$(call log_step,Committing @aiready/$(SPOKE) v$$version...); \
	cd $(ROOT_DIR) && git add packages/$(SPOKE)/package.json; \
	cd $(ROOT_DIR) && git commit -m "chore(release): @aiready/$(SPOKE) v$$version"; \
	tag_name="$(SPOKE)-v$$version"; \
	$(call log_step,Tagging $$tag_name...); \
	cd $(ROOT_DIR) && git tag -f -a "$$tag_name" -m "Release @aiready/$(SPOKE) v$$version"; \
	$(call log_success,Committed and tagged $$tag_name)
endef

# Shorthand dev tag for platform (used by release-dev)
define tag_platform_dev
	$(call tag_dev_release,$(PLATFORM_DIR),platform,@aiready/platform)
endef

# Internal parallel helper for release-all
.PHONY: release-spoke-%
release-spoke-%:
	@$(call log_info,Releasing spoke @aiready/$*...); \
	$(MAKE) npm-publish SPOKE=$* || exit 1; \
	$(MAKE) publish SPOKE=$* OWNER=$(OWNER) || exit 1; \
	$(call log_success,Released @aiready/$*)

###############################################################################
# Version bump targets (4 pattern rules replace 12 individual targets)
###############################################################################

version-landing-%: ## Bump landing version: version-landing-patch|minor|major
	@$(call log_step,Bumping landing version ($*)...)
	@cd $(LANDING_DIR) && npm version $* --no-git-tag-version
	@$(call log_success,landing bumped to $$(node -p "require('$(LANDING_DIR)/package.json').version"))

version-platform-%: ## Bump platform version: version-platform-patch|minor|major
	@$(call log_step,Bumping platform version ($*)...)
	@cd $(PLATFORM_DIR) && npm version $* --no-git-tag-version
	@$(call log_success,platform bumped to $$(node -p "require('$(PLATFORM_DIR)/package.json').version"))

version-vscode-%: ## Bump vscode-extension version: version-vscode-patch|minor|major
	@$(call log_step,Bumping VS Code extension version ($*)...)
	@cd $(EXTENSION_DIR) && npm version $* --no-git-tag-version
	@$(call log_success,vscode-extension bumped to $$(node -p "require('$(EXTENSION_DIR)/package.json').version"))

version-clawmore-%: ## Bump clawmore version: version-clawmore-patch|minor|major
	@$(call log_step,Bumping clawmore version ($*)...)
	@cd $(CLAWMORE_DIR) && npm version $* --no-git-tag-version
	@$(call log_success,clawmore bumped to $$(node -p "require('$(CLAWMORE_DIR)/package.json').version"))

###############################################################################
# ClawMore Release
###############################################################################

release-clawmore: release-clawmore-prod ## Alias -> release-clawmore-prod

release-clawmore-dev: ## Deploy ClawMore to dev stage: TYPE=patch|minor|major
	@$(validate_type)
	@$(MAKE) -C $(ROOT_DIR) version-clawmore-$(TYPE)
	@$(call tag_dev_release,$(CLAWMORE_DIR),clawmore,clawmore)
	@$(call log_step,Building ClawMore...)
	@cd $(CLAWMORE_DIR) && pnpm build
	@$(MAKE) -C $(ROOT_DIR) deploy-clawmore-dev
	@$(MAKE) -C $(ROOT_DIR) test-clawmore-e2e-local
	@cd $(ROOT_DIR) && git push origin $(TARGET_BRANCH) --follow-tags
	@$(call log_success,Dev release finished for clawmore)

release-clawmore-prod: ## Release ClawMore to production: TYPE=patch|minor|major
	@$(validate_type)
	@$(MAKE) -C $(ROOT_DIR) version-clawmore-$(TYPE)
	@$(call commit_and_tag_app,$(CLAWMORE_DIR),clawmore,clawmore,clawmore)
	@$(call log_step,Building ClawMore...)
	@cd $(CLAWMORE_DIR) && pnpm build
	@$(MAKE) -C $(ROOT_DIR) deploy-clawmore-prod
	@$(MAKE) -C $(ROOT_DIR) clawmore-verify || $(call log_warning,Verification timed out - may still be deploying)
	@$(MAKE) -C $(ROOT_DIR) test-clawmore-e2e-local
	@$(MAKE) -C $(ROOT_DIR) publish-clawmore OWNER=$(OWNER)
	@cd $(ROOT_DIR) && git push origin $(TARGET_BRANCH) --follow-tags
	@$(call log_success,Release finished for clawmore)

###############################################################################
# Landing Release
###############################################################################

release-landing: release-landing-prod ## Alias -> release-landing-prod

release-landing-dev: ## Release landing to dev stage: TYPE=patch|minor|major
	@$(validate_type)
	@$(MAKE) -C $(ROOT_DIR) version-landing-$(TYPE)
	@$(call tag_dev_release,$(LANDING_DIR),landing,@aiready/landing)
	@$(MAKE) -C $(ROOT_DIR) test-landing
	@cd $(LANDING_DIR) && pnpm build
	@$(MAKE) -C $(ROOT_DIR) deploy-landing-dev
	@cd $(ROOT_DIR) && git push origin $(TARGET_BRANCH) --follow-tags
	@$(call log_success,Dev release finished for @aiready/landing)

release-landing-prod: ## Release landing to production: TYPE=patch|minor|major
	@$(validate_type)
	@$(MAKE) -C $(ROOT_DIR) version-landing-$(TYPE)
	@$(call commit_and_tag_app,$(LANDING_DIR),landing,@aiready/landing,landing)
	@$(MAKE) -C $(ROOT_DIR) test-landing
	@$(MAKE) -C $(ROOT_DIR) test-landing-e2e-local
	@cd $(LANDING_DIR) && pnpm build
	@$(MAKE) -C $(ROOT_DIR) deploy-landing-prod
	@$(MAKE) -C $(ROOT_DIR) landing-verify VERIFY_RETRIES=3 VERIFY_WAIT=10 || \
		$(call log_warning,Verification timed out - CloudFront may still be propagating)
	@$(MAKE) -C $(ROOT_DIR) publish-landing OWNER=$(OWNER)
	@cd $(ROOT_DIR) && git push origin $(TARGET_BRANCH) --follow-tags
	@$(call log_success,Release finished for @aiready/landing)

###############################################################################
# Platform Release
###############################################################################

release-platform: ## Release platform to production: TYPE=patch|minor|major
	@$(validate_type)
	@$(MAKE) -C $(ROOT_DIR) version-platform-$(TYPE)
	@$(call commit_and_tag_app,$(PLATFORM_DIR),platform,@aiready/platform,platform)
	@$(MAKE) -C $(ROOT_DIR) build
	@CI=1 $(MAKE) -C $(ROOT_DIR) test
	@CI=1 $(MAKE) -C $(ROOT_DIR) test-contract
	@CI=1 $(MAKE) -C $(ROOT_DIR) test-integration
	@CI=1 $(MAKE) -C $(ROOT_DIR) test-verify-cli
	@CI=1 $(MAKE) -C $(ROOT_DIR) test-platform
	@CI=1 $(MAKE) -C $(ROOT_DIR) test-platform-e2e-local
	@$(MAKE) -C $(ROOT_DIR) deploy-platform-prod
	@$(MAKE) -C $(ROOT_DIR) platform-verify || \
		$(call log_warning,Verification failed - platform may still be deploying)
	@cd $(ROOT_DIR) && git push origin $(TARGET_BRANCH) --follow-tags
	@$(call log_success,Release finished for @aiready/platform)

###############################################################################
# VS Code Extension Release
###############################################################################

release-vscode: ## Release VS Code extension: TYPE=patch|minor|major
	@$(validate_type)
	@$(MAKE) -C $(ROOT_DIR) version-vscode-$(TYPE)
	@$(call commit_and_tag_app,$(EXTENSION_DIR),vscode-extension,vscode-extension,vscode-extension)
	@cd $(EXTENSION_DIR) && pnpm build
	@$(MAKE) -C $(ROOT_DIR) publish-vscode-sync OWNER=$(OWNER)
	@cd $(ROOT_DIR) && git push origin $(TARGET_BRANCH) --follow-tags
	@$(call log_success,Release finished for VS Code extension)

###############################################################################
# npm Spoke Releases
###############################################################################

check-changes: ## Check if SPOKE has changes since last release tag
	$(call require_spoke)
	@last_tag=$$(git for-each-ref 'refs/tags/$(SPOKE)-v*' --sort=-creatordate --format '%(refname:short)' | head -n1); \
	if [ -z "$$last_tag" ]; then \
		$(call log_info,No previous release tag for @aiready/$(SPOKE)); \
		echo "has_changes"; exit 0; \
	fi; \
	if git diff --quiet "$$last_tag" -- packages/$(SPOKE); then \
		if $(MAKE) -s check-dependency-updates SPOKE=$(SPOKE) | grep -q "has_outdated_deps"; then \
			$(call log_info,Outdated dependencies detected); echo "has_changes"; exit 0; \
		fi; \
		$(call log_info,No changes since $$last_tag); echo "no_changes"; exit 1; \
	fi; \
	$(call log_info,Code changes detected since $$last_tag); echo "has_changes"

check-dependency-updates: ## Check if SPOKE's published dependencies have newer versions
	$(call require_spoke)
	@./makefiles/scripts/check-dependency-updates.sh $(SPOKE)

release-one: ## Release one npm spoke: SPOKE=name TYPE=patch|minor|major
	$(call require_spoke)
	@$(validate_type)
	@$(MAKE) -C $(ROOT_DIR) $(call bump_target_for_type,$(TYPE)) SPOKE=$(SPOKE)
	@$(call commit_and_tag)
	@$(MAKE) -C $(ROOT_DIR) build
	@$(MAKE) -C $(ROOT_DIR) test-contract SPOKE=$(SPOKE)
	@$(MAKE) -C $(ROOT_DIR) test-integration
	@$(MAKE) -C $(ROOT_DIR) test-verify-cli
	@if [ "$(SPOKE)" = "core" ] || [ "$(SPOKE)" = "cli" ]; then \
		$(call log_step,HUB RELEASE: Running downstream safety checks...); \
		$(MAKE) -C $(ROOT_DIR) test-downstream || { \
			$(call log_error,Downstream checks failed. Aborting.); exit 1; \
		}; \
	fi
	@$(MAKE) -C $(ROOT_DIR) npm-publish SPOKE=$(SPOKE)
	@$(MAKE) -C $(ROOT_DIR) publish SPOKE=$(SPOKE) OWNER=$(OWNER)
	@cd $(ROOT_DIR) && git push origin $(TARGET_BRANCH) --follow-tags
	@$(call log_success,Release finished for @aiready/$(SPOKE))

# Build+test once, then version-bump -> publish in order: core -> middle -> cli
# Landing, platform, and clawmore are excluded -- use their dedicated targets.
release-all: ## Release all npm spokes: TYPE=patch|minor|major
	@$(validate_type)
	@$(call log_step,Phase 1: Build...)
	@$(MAKE) -C $(ROOT_DIR) build
	@$(call log_step,Phase 2: Full test suite...)
	@$(MAKE) -C $(ROOT_DIR) test
	@$(MAKE) -C $(ROOT_DIR) test-contract
	@$(MAKE) -C $(ROOT_DIR) test-integration
	@$(MAKE) -C $(ROOT_DIR) test-platform-e2e-local
	@$(MAKE) -C $(ROOT_DIR) test-downstream
	@$(call log_step,Phase 3: Version bump all spokes...)
	@for spoke in $(CORE_SPOKE) $(MIDDLE_SPOKES) $(CLI_SPOKE); do \
		$(MAKE) -C $(ROOT_DIR) $(call bump_target_for_type,$(TYPE)) SPOKE=$$spoke || exit 1; \
	done
	@$(call log_step,Phase 4: Commit + tag all...)
	@cd $(ROOT_DIR) && git add packages/*/package.json && \
		git commit -m "chore(release): version bumps across spokes" || true
	@for spoke in $(CORE_SPOKE) $(MIDDLE_SPOKES) $(CLI_SPOKE); do \
		version=$$(node -p "require('$(ROOT_DIR)/packages/$$spoke/package.json').version"); \
		cd $(ROOT_DIR) && git tag -f -a "$$spoke-v$$version" -m "Release @aiready/$$spoke v$$version" || true; \
	done
	@$(call log_step,Phase 5: Publish core...)
	@$(MAKE) -C $(ROOT_DIR) npm-publish SPOKE=$(CORE_SPOKE)
	@$(MAKE) -C $(ROOT_DIR) publish SPOKE=$(CORE_SPOKE) OWNER=$(OWNER)
	@$(call log_step,Phase 6: Publish middle spokes in parallel...)
	@$(MAKE) $(MAKE_PARALLEL) $(addprefix release-spoke-,$(MIDDLE_SPOKES))
	@$(call log_step,Phase 7: Publish CLI...)
	@$(MAKE) -C $(ROOT_DIR) npm-publish SPOKE=$(CLI_SPOKE)
	@$(MAKE) -C $(ROOT_DIR) publish SPOKE=$(CLI_SPOKE) OWNER=$(OWNER)
	@cd $(ROOT_DIR) && git push origin $(TARGET_BRANCH) --follow-tags
	@$(call log_success,All spokes released: core -> middle -> cli)

###############################################################################
# Dev pipeline + Status
###############################################################################

release-dev: ## Dev pipeline: build + test + deploy platform dev + E2E
	@$(MAKE) -C $(ROOT_DIR) build
	@$(MAKE) -C $(ROOT_DIR) test
	@$(MAKE) -C $(ROOT_DIR) test-contract
	@$(MAKE) -C $(ROOT_DIR) deploy-platform
	@$(call tag_platform_dev)
	@$(MAKE) -C $(ROOT_DIR) test-platform-e2e
	@$(MAKE) -C $(ROOT_DIR) test-landing-e2e
	@cd $(ROOT_DIR) && git push origin --follow-tags
	@$(call log_success,Dev release pipeline complete!)

release-status: ## Show local vs published/tagged versions for all components
	@echo ""; \
	printf "%-30s %-15s %-17s %-10s\n" "Component" "Local" "Published/Tag" "Status"; \
	printf "%-30s %-15s %-17s %-10s\n" "---------" "-----" "-------------" "------"; \
	for spoke in $(ALL_SPOKES); do \
		[ -f "$(ROOT_DIR)/packages/$$spoke/package.json" ] || continue; \
		local_ver=$$(node -p "require('$(ROOT_DIR)/packages/$$spoke/package.json').version" 2>/dev/null || echo "n/a"); \
		npm_ver=$$(npm view @aiready/$$spoke version 2>/dev/null || echo "n/a"); \
		[ "$$local_ver" = "$$npm_ver" ] && s="$(GREEN)OK$(RESET_COLOR)" || \
			{ [ "$$npm_ver" = "n/a" ] && s="$(YELLOW)new$(RESET_COLOR)" || s="$(CYAN)ahead$(RESET_COLOR)"; }; \
		printf "%-30s %-15s %-17s %-10b\n" "@aiready/$$spoke" "$$local_ver" "$$npm_ver (npm)" "$$s"; \
	done; \
	for app in landing platform clawmore; do \
		app_dir="$(ROOT_DIR)/$$app"; \
		[ -f "$$app_dir/package.json" ] || continue; \
		local_ver=$$(node -p "require('$$app_dir/package.json').version" 2>/dev/null || echo "n/a"); \
		last_tag=$$(git for-each-ref "refs/tags/$$app-v*" --sort=-creatordate --format '%(refname:short)' | head -n1 | sed "s/$$app-v//"); \
		[ -z "$$last_tag" ] && last_tag="n/a"; \
		[ "$$local_ver" = "$$last_tag" ] && s="$(GREEN)OK$(RESET_COLOR)" || \
			{ [ "$$last_tag" = "n/a" ] && s="$(YELLOW)new$(RESET_COLOR)" || s="$(CYAN)ahead$(RESET_COLOR)"; }; \
		printf "%-30s %-15s %-17s %-10b\n" "$$app" "$$local_ver" "$$last_tag (tag)" "$$s"; \
	done; \
	if [ -f "$(EXTENSION_DIR)/package.json" ]; then \
		local_ver=$$(node -p "require('$(EXTENSION_DIR)/package.json').version" 2>/dev/null || echo "n/a"); \
		last_tag=$$(git for-each-ref 'refs/tags/vscode-extension-v*' --sort=-creatordate --format '%(refname:short)' | head -n1 | sed 's/vscode-extension-v//'); \
		[ -z "$$last_tag" ] && last_tag="n/a"; \
		[ "$$local_ver" = "$$last_tag" ] && s="$(GREEN)OK$(RESET_COLOR)" || \
			{ [ "$$last_tag" = "n/a" ] && s="$(YELLOW)new$(RESET_COLOR)" || s="$(CYAN)ahead$(RESET_COLOR)"; }; \
		printf "%-30s %-15s %-17s %-10b\n" "vscode-extension" "$$local_ver" "$$last_tag (tag)" "$$s"; \
	fi; \
	echo ""; \
	$(call log_success,Status collected)

release-help: ## Show release targets and examples
	@printf "%-45s %s\n" "Target" "Description"
	@printf "%-45s %s\n" "------" "-----------"
	@printf "%-45s %s\n" "release-one SPOKE=name TYPE=patch" "Release one npm spoke"
	@printf "%-45s %s\n" "release-all TYPE=minor" "Release all npm spokes (core->middle->cli)"
	@printf "%-45s %s\n" "release-clawmore-dev TYPE=patch" "Deploy ClawMore to dev"
	@printf "%-45s %s\n" "release-clawmore-prod TYPE=patch" "Release ClawMore to production"
	@printf "%-45s %s\n" "release-landing-dev TYPE=minor" "Deploy landing to dev"
	@printf "%-45s %s\n" "release-landing-prod TYPE=minor" "Release landing to production"
	@printf "%-45s %s\n" "release-platform TYPE=patch" "Release platform to production"
	@printf "%-45s %s\n" "release-vscode TYPE=patch" "Release VS Code extension"
	@printf "%-45s %s\n" "release-status" "Show all component versions"
	@printf "%-45s %s\n" "check-changes SPOKE=cli" "Check if spoke has unreleased changes"
