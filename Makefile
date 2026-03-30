# Hub includes these spokes
include tooling/makefiles/Makefile.shared.mk
include tooling/makefiles/Makefile.quality.mk
include tooling/makefiles/Makefile.setup.mk
include tooling/makefiles/Makefile.build.mk
include tooling/makefiles/Makefile.test.mk
include tooling/makefiles/Makefile.release.mk  # This includes Makefile.publish.mk
include tooling/makefiles/Makefile.stats.mk
include tooling/makefiles/Makefile.deploy.mk
include tooling/makefiles/Makefile.distribution.mk

# (PNPM and TURBO are defined in Makefile.shared.mk)

.DEFAULT_GOAL := help

help-agent: help # Show optimized help for AI agents

help: ## Show all targets and descriptions in a markdown table (one aligned table per spoke, with color and emoji)
	@for f in $(wildcard tooling/makefiles/Makefile.*.mk); do \
		if ! grep -qE '^[a-zA-Z0-9_-]+:.*## ' "$$f"; then continue; fi; \
		spoke=$$(basename $$f); \
		spoke=$${spoke#Makefile.}; spoke=$${spoke%.mk}; \
		case $$spoke in \
			shared)  color=$$(tput setaf 6); emoji="🔗";; \
			quality) color=$$(tput setaf 2); emoji="🧹";; \
			setup)   color=$$(tput setaf 5); emoji="⚙️ ";; \
			build)   color=$$(tput setaf 4); emoji="🔨";; \
			test)    color=$$(tput setaf 3); emoji="🧪";; \
			release) color=$$(tput setaf 1); emoji="🚀";; \
			publish) color=$$(tput setaf 1); emoji="🚚";; \
			stats)   color=$$(tput setaf 6); emoji="📊";; \
			deploy)  color=$$(tput setaf 5); emoji="☁️ ";; \
			*)       color=$$(tput setaf 7); emoji="📦";; \
		esac; \
		echo ""; \
		echo "$${color}$${emoji} $$(echo $$spoke | tr a-z A-Z) $${emoji}$$(tput sgr0)"; \
		echo ""; \
		bold=$$(tput bold); reset=$$(tput sgr0); \
		{ \
			grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $$f | \
			while IFS= read -r line; do \
			  target=$$(printf "%s" "$$line" | sed -E 's/:.*//'); \
			  desc=$$(printf "%s" "$$line" | sed -E 's/^[^:]+:.*## //'); \
			  if [ -n "$$target" ] && [ -n "$$desc" ]; then \
			    printf "| %s%s%s%s | %s |\n" "$$color" "$$bold" "$$target" "$$reset" "$$desc"; \
			  fi; \
			done; \
		} | column -t -s'|'; \
		echo ""; \
	done

pre-commit: ## Run pre-commit checks (lint-staged on staged files only)
	@$(call log_step,Running pre-commit checks...)
	@if ! $(MAKE) QUIET=1 lint-staged; then \
		$(call separator,$(RED)); \
		$(call log_error,make lint-staged failed); \
		$(call separator,$(RED)); \
		echo ""; \
		echo "➡️  Fix the inner most errors above, then gradually work outward"; \
		echo ""; \
		exit 1; \
	fi
	@$(call log_success,Pre-commit checks passed)

pre-push: ## Run pre-push checks (quality checks + AIReady scan)
	@if [ "$$SKIP_PRE_PUSH" = "true" ]; then \
		$(call log_info,⏭️  Skipping AIReady pre-push scan (SKIP_PRE_PUSH=true)); \
	else \
		$(call log_step,🔍 Checking for un-synced spoke changes...); \
		SPOKE_PATTERN="^(packages/|apps/|tooling/github-action/|tooling/homebrew/)"; \
		CHANGED_SPOKES=$$(git diff --name-only origin/$(TARGET_BRANCH) 2>/dev/null | grep -E "$$SPOKE_PATTERN" | cut -d/ -f1-2 | sort -u); \
		if [ -n "$$CHANGED_SPOKES" ]; then \
			$(call separator,$(RED)); \
			$(call log_error,Spoke changes detected! Use 'make sync' instead of 'git push' to update standalone repos.); \
			echo "$$CHANGED_SPOKES" | sed 's/^/   - /'; \
			$(call separator,$(RED)); \
			echo ""; \
			echo "👉 To fix this, run: make sync"; \
			echo ""; \
			exit 1; \
		fi; \
		$(call log_step,🔧 Running quality checks (lint + type-check + format-check) in parallel...); \
		if command -v $(TURBO) >/dev/null 2>&1 || [ -f ./node_modules/.bin/turbo ]; then \
			unset npm_config_loglevel; \
			$(TURBO) run lint type-check format-check || { \
				$(call log_error,Quality checks failed — fix before pushing); \
				exit 1; \
			}; \
		fi; \
		$(call log_step,🚀 Running AIReady pre-push scan (Threshold: 75)...); \
		aiready scan . --threshold 75; \
	fi

lint-staged: ## Run lint-staged on changed files
	@$(call log_info,Running lint-staged...)
	@$(PNPM) $(SILENT_PNPM) lint-staged

