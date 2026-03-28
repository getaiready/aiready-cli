# Deployment Automation
# Deploy landing page and platform to AWS

# Resolve this makefile's directory to allow absolute invocation
MAKEFILE_DIR := $(dir $(lastword $(MAKEFILE_LIST)))
include $(MAKEFILE_DIR)/Makefile.shared.mk

.PHONY: deploy-landing deploy-landing-prod deploy-landing-remove landing-logs landing-verify landing-cleanup
.PHONY: deploy-platform deploy-platform-prod deploy-platform-remove platform-logs platform-verify
.PHONY: deploy-clawmore deploy-clawmore-dev deploy-clawmore-prod clawmore-verify
.PHONY: ses-domain-status ses-production-access-status ses-request-production-access
.PHONY: deploy-health-check health-check-config health-check-logs deploy-health-check-full

SES_MAIL_TYPE ?= TRANSACTIONAL
SES_WEBSITE_URL ?= https://$(DOMAIN_NAME)
SES_CONTACT_LANGUAGE ?= EN
SES_ADDITIONAL_CONTACT_EMAILS ?=

##@ Deployment

deploy-landing: verify-aws-account ## Deploy landing page to AWS (default/dev user environment)
	@$(call log_step,Deploying landing page to AWS (dev))
	@echo "$(CYAN)Using AWS Profile: $(AWS_PROFILE)$(NC)"
	@echo "$(CYAN)Using AWS Region: $(AWS_REGION)$(NC)"
	@cd landing && \
		set -a && [ -f .env ] && . ./.env || true && set +a && \
		export AWS_PROFILE=$${AWS_PROFILE:-$(AWS_PROFILE)} && \
		export AWS_REGION=$${AWS_REGION:-$(AWS_REGION)} && \
		export CLOUDFLARE_API_TOKEN="$${CLOUDFLARE_API_TOKEN}" && \
		export CLOUDFLARE_ACCOUNT_ID="$${CLOUDFLARE_ACCOUNT_ID}" && \
		sst deploy --yes
	@$(call log_success,Landing page deployed)

deploy-landing-dev: verify-aws-account ## Deploy landing page to AWS (dedicated dev stage)
	@$(call log_step,Deploying landing page to AWS (stage: dev))
	@echo "$(CYAN)Using AWS Profile: $(AWS_PROFILE)$(NC)"
	@echo "$(CYAN)Using AWS Region: $(AWS_REGION)$(NC)"
	@cd landing && \
		set -a && [ -f .env ] && . ./.env || true && set +a && \
		export AWS_PROFILE=$${AWS_PROFILE:-$(AWS_PROFILE)} && \
		export AWS_REGION=$${AWS_REGION:-$(AWS_REGION)} && \
		export CLOUDFLARE_API_TOKEN="$${CLOUDFLARE_API_TOKEN}" && \
		export CLOUDFLARE_ACCOUNT_ID="$${CLOUDFLARE_ACCOUNT_ID}" && \
		sst deploy --stage dev --yes
	@$(call log_success,Landing page deployed to stage: dev)

deploy-landing-prod: verify-aws-account ## Deploy landing page to AWS (production)
	@$(call log_step,Deploying landing page to AWS (production))
	@echo "$(YELLOW)⚠️  Deploying to PRODUCTION$(NC)"
	@echo "$(CYAN)Using AWS Profile: $(AWS_PROFILE)$(NC)"
	@echo "$(CYAN)Using AWS Region: $(AWS_REGION)$(NC)"
	@cd landing && \
		set -a && [ -f .env ] && . ./.env || true && set +a && \
		export AWS_PROFILE=$${AWS_PROFILE:-$(AWS_PROFILE)} && \
		export AWS_REGION=$${AWS_REGION:-$(AWS_REGION)} && \
		export CLOUDFLARE_API_TOKEN="$${CLOUDFLARE_API_TOKEN}" && \
		export CLOUDFLARE_ACCOUNT_ID="$${CLOUDFLARE_ACCOUNT_ID}" && \
		sst deploy --stage production --yes
	@$(call log_success,Landing page deployed to production)
	@echo "$(CYAN)💡 Blog files synced during build, CloudFront invalidated automatically$(NC)"
	@echo ""
	@$(MAKE) -f $(MAKEFILE_DIR)/Makefile.deploy.mk landing-verify

landing-verify: ## Verify site is accessible
	@$(call log_step,Verifying site is accessible)
	@if curl -fsS -o /dev/null https://getaiready.dev >/dev/null 2>&1; then \
		echo "$(GREEN)✓ Site is live and responding$(NC)"; \
		echo "$(CYAN)🌐 URL: https://getaiready.dev$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  Site may still be deploying$(NC)"; \
		echo "$(CYAN)💡 SST handles invalidation automatically - site will be live shortly$(NC)"; \
	fi
	@echo ""

deploy-landing-remove: ## Remove landing page deployment (dev)
	@$(call log_warning,Removing landing page deployment from AWS (dev))
	@cd landing && \
		AWS_PROFILE=$(AWS_PROFILE) AWS_REGION=$(AWS_REGION) sst remove --yes
	@$(call log_success,Landing page deployment removed)

landing-logs: ## Show landing page logs (requires SST dashboard)
	@$(call log_step,Opening SST dashboard for logs)
	@cd landing && \
		AWS_PROFILE=$(AWS_PROFILE) AWS_REGION=$(AWS_REGION) sst dev

##@ ClawMore Deployment

deploy-clawmore: verify-aws-account ## Deploy ClawMore to AWS (default stage)
	@$(call log_step,Deploying ClawMore to AWS)
	@cd clawmore && \
		set -a && [ -f .env ] && . ./.env || true && set +a && \
		export AWS_PROFILE=$${AWS_PROFILE:-$(AWS_PROFILE)} && \
		export AWS_REGION=$${AWS_REGION:-$(AWS_REGION)} && \
		sst deploy --yes
	@$(call log_success,ClawMore deployed)

deploy-clawmore-dev: verify-aws-account ## Deploy ClawMore to AWS (stage: dev)
	@$(call log_step,Deploying ClawMore to AWS (stage: dev))
	@cd clawmore && \
		set -a && [ -f .env ] && . ./.env || true && set +a && \
		export AWS_PROFILE=$${AWS_PROFILE:-$(AWS_PROFILE)} && \
		export AWS_REGION=$${AWS_REGION:-$(AWS_REGION)} && \
		sst deploy --stage dev --yes
	@$(call log_success,ClawMore deployed to stage: dev)

deploy-clawmore-prod: verify-aws-account ## Deploy ClawMore to AWS (production)
	@$(call log_step,Deploying ClawMore to AWS (production))
	@echo "$(YELLOW)⚠️  Deploying to PRODUCTION$(NC)"
	@cd clawmore && \
		set -a && [ -f .env ] && . ./.env || true && set +a && \
		export AWS_PROFILE=$${AWS_PROFILE:-$(AWS_PROFILE)} && \
		export AWS_REGION=$${AWS_REGION:-$(AWS_REGION)} && \
		sst deploy --stage production --yes
	@$(call log_success,ClawMore deployed to production)
	@$(MAKE) -f $(MAKEFILE_DIR)/Makefile.deploy.mk clawmore-verify

clawmore-verify: ## Verify ClawMore is accessible
	@$(call log_step,Verifying ClawMore is accessible)
	@DOMAIN=$$( [ "$$STAGE" = "production" ] && echo "clawmore.getaiready.dev" || echo "dev.clawmore.getaiready.dev" ); \
	if curl -fsS -o /dev/null "https://$$DOMAIN" >/dev/null 2>&1; then \
		echo "$(GREEN)✓ ClawMore is live and responding$(NC)"; \
		echo "$(CYAN)🌐 URL: https://$$DOMAIN$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  ClawMore may still be deploying$(NC)"; \
	fi

dev-clawmore: ## Run ClawMore locally in development mode (SST dev --stage local)
	@$(call log_step,Starting ClawMore dev server with SST...)
	@echo "$(CYAN)Using AWS profile: $(GREEN)aiready$(NC)"
	@echo "$(CYAN)ClawMore will be available at: $(GREEN)http://localhost:8886$(NC)"
	@cd clawmore && \
		[ -f .env.local ] && set -a && . ./.env.local && set +a || true && \
		AWS_PROFILE=aiready $(PNPM) dev

clawmore-logs: ## Show ClawMore logs (runs sst dev)
	@$(call log_step,Starting SST dev mode for ClawMore)
	@cd clawmore && \
		set -a && [ -f .env ] && . ./.env || true && set +a && \
		export AWS_PROFILE=$${AWS_PROFILE:-$(AWS_PROFILE)} && \
		sst dev

##@ Platform Deployment

deploy-platform: verify-aws-account ## Deploy platform to AWS (dev environment)
	@$(call log_step,Deploying platform to AWS (dev))
	@echo "$(CYAN)Using AWS Profile: $(AWS_PROFILE)$(NC)"
	@cd platform && \
		[ -f .env.dev ] && set -a && . ./.env.dev && set +a || true && \
		export NEXT_PUBLIC_APP_URL=$${NEXT_PUBLIC_APP_URL:-https://dev.platform.getaiready.dev} && \
		AWS_PROFILE=$(AWS_PROFILE) pnpm run deploy
	@$(call log_success,Platform deployed to dev)
	@$(MAKE) platform-verify

deploy-platform-prod: verify-aws-account ## Deploy platform to AWS (production)
	@$(call log_step,Deploying platform to AWS (production))
	@echo "$(YELLOW)⚠️  Deploying to PRODUCTION$(NC)"
	@echo "$(CYAN)Using AWS Profile: $(AWS_PROFILE)$(NC)"
	@cd platform && \
		[ -f .env.prod ] && set -a && . ./.env.prod && set +a || true && \
		AWS_PROFILE=$(AWS_PROFILE) pnpm run deploy:prod
	@$(call log_success,Platform deployed to production)


##@ Email (SES)

ses-domain-status: verify-aws-account ## Show SES domain identity status for DOMAIN_NAME
	@$(call log_step,Checking SES domain identity for $(DOMAIN_NAME) in $(AWS_REGION))
	@OUT=$$(aws sesv2 get-email-identity \
		--email-identity "$(DOMAIN_NAME)" \
		--profile $(AWS_PROFILE) \
		--region $(AWS_REGION) \
		--output json 2>/dev/null || true); \
	if [ -z "$$OUT" ]; then \
		$(call log_warning,No SES identity found for $(DOMAIN_NAME). Deploy landing production stage to create it.); \
		exit 1; \
	fi; \
	echo "$$OUT" | jq '{IdentityName, IdentityType, VerifiedForSendingStatus, DkimAttributes}'

ses-production-access-status: verify-aws-account ## Show SES production access status in AWS_REGION
	@$(call log_step,Checking SES production access status in $(AWS_REGION))
	@aws sesv2 get-account \
		--profile $(AWS_PROFILE) \
		--region $(AWS_REGION) \
		--output json | jq '{ProductionAccessEnabled, SendQuota}'

ses-request-production-access: verify-aws-account ## Request SES production access (requires verified domain identity)
	@$(call log_warning,Requesting SES production access in $(AWS_REGION) for $(DOMAIN_NAME))
	@EXTRA_ARGS=""; \
	if [ -n "$(SES_ADDITIONAL_CONTACT_EMAILS)" ]; then \
		EXTRA_ARGS="--additional-contact-email-addresses $(SES_ADDITIONAL_CONTACT_EMAILS)"; \
	fi; \
	aws sesv2 put-account-details \
		--production-access-enabled \
		--mail-type "$(SES_MAIL_TYPE)" \
		--website-url "$(SES_WEBSITE_URL)" \
		--contact-language "$(SES_CONTACT_LANGUAGE)" \
		$$EXTRA_ARGS \
		--profile $(AWS_PROFILE) \
		--region $(AWS_REGION)
	@$(call log_success,SES production access request submitted. Approval is asynchronous.)
	@$(MAKE) -f $(MAKEFILE_DIR)/Makefile.deploy.mk ses-production-access-status
	@$(MAKE) platform-verify

platform-verify: ## Verify platform is accessible
	@$(call log_step,Verifying platform is accessible)
	@APP_URL=$${NEXT_PUBLIC_APP_URL:-https://platform.getaiready.dev}; \
	if curl -fsS -o /dev/null "$$APP_URL" >/dev/null 2>&1; then \
		echo "$(GREEN)✓ Platform is live and responding$(NC)"; \
		echo "$(CYAN)🌐 URL: $$APP_URL$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  Platform may still be deploying$(NC)"; \
		echo "$(CYAN)💡 SST handles invalidation automatically - platform will be live shortly$(NC)"; \
	fi
	@echo ""

deploy-platform-remove: ## Remove platform deployment (dev)
	@$(call log_warning,Removing platform deployment from AWS (dev))
	@cd platform && \
		set -a && [ -f .env.dev ] && . ./.env.dev || true && set +a && \
		export AWS_PROFILE=$${AWS_PROFILE:-$(AWS_PROFILE)} && \
		AWS_PROFILE=$(AWS_PROFILE) pnpm sst:remove --yes
	@$(call log_success,Platform deployment removed)

platform-logs: ## Show platform logs (requires SST dev mode)
	@$(call log_step,Opening SST dev mode for logs)
	@cd platform && \
		set -a && [ -f .env.dev ] && . ./.env.dev || true && set +a && \
		AWS_PROFILE=$(AWS_PROFILE) pnpm sst:dev

deploy-platform-status: ## Show current platform deployment status
	@echo "$(CYAN)📊 Platform Deployment Status$(NC)\n"
	@cd platform && \
		set -a && [ -f .env.dev ] && . ./.env.dev || true && set +a && \
		AWS_PROFILE=$(AWS_PROFILE) pnpm sst:list || \
		echo "$(YELLOW)No deployments found$(NC)"

##@ General Deployment

deploy-check: ## Check AWS credentials and SST installation
	@echo "$(CYAN)🔍 Checking deployment prerequisites...$(NC)\n"
	@echo "$(GREEN)AWS Profile:$(NC) $(AWS_PROFILE)"
	@echo "$(GREEN)AWS Region:$(NC) $(AWS_REGION)"
	@echo ""
	@if command -v sst >/dev/null 2>&1; then \
		echo "$(GREEN)✓ SST CLI installed:$(NC) $$(sst --version)"; \
	else \
		echo "$(RED)✗ SST CLI not found$(NC)"; \
		echo "  Install: npm install -g sst@ion"; \
		exit 1; \
	fi
	@echo ""
	@if aws sts get-caller-identity --profile $(AWS_PROFILE) >/dev/null 2>&1; then \
		echo "$(GREEN)✓ AWS credentials valid$(NC)"; \
		aws sts get-caller-identity --profile $(AWS_PROFILE) | \
			jq -r '"  Account: \(.Account)\n  User: \(.Arn)"'; \
	else \
		echo "$(RED)✗ AWS credentials invalid or not found$(NC)"; \
		echo "  Configure: aws configure --profile $(AWS_PROFILE)"; \
		exit 1; \
	fi
	@echo ""
	@$(call log_success,All prerequisites met)

deploy-all: deploy-landing deploy-platform ## Deploy both landing and platform (dev)
	@$(call log_success,All services deployed to dev)

deploy-all-prod: deploy-landing-prod deploy-platform-prod ## Deploy both landing and platform (production)
	@$(call log_success,All services deployed to production)

deploy-landing-status: ## Show current deployment status
	@echo "$(CYAN)📊 Landing Page Deployment Status$(NC)\n"
	@cd landing && \
		AWS_PROFILE=$(AWS_PROFILE) AWS_REGION=$(AWS_REGION) sst list || \
		echo "$(YELLOW)No deployments found$(NC)"

domain-status: ## Check Cloudflare zone status and nameservers
	@$(call log_step,Checking Cloudflare zone status)
	@cd landing && \
		set -a && [ -f .env ] && . ./.env || true && set +a && \
		if [ -z "$$CLOUDFLARE_API_TOKEN" ] || [ -z "$$CLOUDFLARE_ACCOUNT_ID" ]; then \
			echo "$(YELLOW)Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID$(NC)"; exit 1; \
		fi; \
		curl -s -H "Authorization: Bearer $$CLOUDFLARE_API_TOKEN" "https://api.cloudflare.com/client/v4/zones?name=$${DOMAIN_NAME:-getaiready.dev}&account.id=$$CLOUDFLARE_ACCOUNT_ID" | jq '{success, result: ( .result[] | {id, name, status, name_servers, account: .account.id} )}' || true

leads-export: ## Export submissions from S3 to local CSV
	@$(call log_step,Exporting leads from S3)
	@mkdir -p .aiready/leads/submissions
	@bucket=$$(cd landing && AWS_PROFILE=$(AWS_PROFILE) AWS_REGION=$(AWS_REGION) sst list | awk '/submissionsBucket:/ {print $$2}'); \
	if [ -z "$$bucket" ]; then \
		echo "$(RED)✗ Could not detect submissions bucket$(NC)"; exit 1; \
	fi; \
	aws s3 sync s3://$$bucket/submissions .aiready/leads/submissions --delete --profile $(AWS_PROFILE) || exit 1; \
	jq -r '["email","repoUrl","receivedAt"], (.aiready/leads/submissions/*.json | map( [ .email, .repoUrl, .receivedAt ] ))[] | @csv' \
		<(jq -s '.' .aiready/leads/submissions/*.json 2>/dev/null) > .aiready/leads/leads.csv 2>/dev/null || \
		echo "$(YELLOW)No submissions found yet$(NC)"; \
	echo "$(GREEN)✓ Exported to .aiready/leads/leads.csv$(NC)"

leads-open: ## Open leads folder
	@open .aiready/leads 2>/dev/null || xdg-open .aiready/leads 2>/dev/null || echo "Path: .aiready/leads"

landing-cleanup: ## Clean up stale AWS resources from old deployments
	@$(call log_warning,Scanning for stale AWS resources)
	@echo "$(CYAN)Checking CloudFront distributions...$(NC)"
	@OLD_DISTS=$$(aws cloudfront list-distributions --profile $(AWS_PROFILE) 2>/dev/null | \
		jq -r '.DistributionList.Items[] | select(.Aliases.Quantity == 0 and (.Comment | contains("aiready") or contains("landing"))) | .Id'); \
	if [ -n "$$OLD_DISTS" ]; then \
		echo "$(YELLOW)Found CloudFront distributions without aliases:$(NC)"; \
		for dist in $$OLD_DISTS; do \
			DOMAIN=$$(aws cloudfront get-distribution --id $$dist --profile $(AWS_PROFILE) 2>/dev/null | jq -r '.Distribution.DomainName'); \
			echo "  - $$dist ($$DOMAIN)"; \
		done; \
		echo "$(YELLOW)💡 To disable: aws cloudfront get-distribution-config --id <ID> > /tmp/dist.json$(NC)"; \
		echo "$(YELLOW)   Then: aws cloudfront update-distribution --id <ID> --if-match <ETag> --distribution-config <config-with-Enabled=false>$(NC)"; \
		echo "$(YELLOW)   Finally: aws cloudfront delete-distribution --id <ID> --if-match <ETag>$(NC)"; \
	else \
		echo "$(GREEN)✓ No stale CloudFront distributions$(NC)"; \
	fi
	@echo ""
	@echo "$(CYAN)Checking Lambda functions...$(NC)"
	@OLD_LAMBDAS=$$(aws lambda list-functions --region $(AWS_REGION) --profile $(AWS_PROFILE) 2>/dev/null | \
		jq -r '.Functions[] | select(.FunctionName | contains("pengcao") or contains("dev")) | .FunctionName'); \
	if [ -n "$$OLD_LAMBDAS" ]; then \
		echo "$(YELLOW)Found dev/test Lambda functions:$(NC)"; \
		for func in $$OLD_LAMBDAS; do \
			echo "  - $$func"; \
		done; \
		echo "$(YELLOW)💡 To delete: aws lambda delete-function --function-name <NAME> --region $(AWS_REGION)$(NC)"; \
	else \
		echo "$(GREEN)✓ No stale Lambda functions$(NC)"; \
	fi
	@echo ""
	@echo "$(CYAN)Checking ACM certificates...$(NC)"
	@aws acm list-certificates --region us-east-1 --profile $(AWS_PROFILE) 2>/dev/null | \
		jq -r '.CertificateSummaryList[] | select(.DomainName == "getaiready.dev") | "\(.CertificateArn) - InUse: \(.InUse)"' | \
		while read -r cert; do echo "  $$cert"; done
	@echo "$(CYAN)💡 Certificates are auto-deleted when CloudFront distributions are removed$(NC)"
	@echo ""
	@$(call log_success,Cleanup scan complete)

##@ Decentralized Monitoring

# Internal macro for wrangler with standard envs
define wrangler_cmd
	(cd $(1) && \
	export CLOUDFLARE_API_TOKEN=$$( [ -n "$(CLOUDFLARE_API_TOKEN)" ] && echo "$(CLOUDFLARE_API_TOKEN)" || grep "CLOUDFLARE_API_TOKEN" ../../landing/.env 2>/dev/null | cut -d= -f2- ); \
	export CLOUDFLARE_ACCOUNT_ID=$$( [ -n "$(CLOUDFLARE_ACCOUNT_ID)" ] && echo "$(CLOUDFLARE_ACCOUNT_ID)" || grep "CLOUDFLARE_ACCOUNT_ID" ../../landing/.env 2>/dev/null | cut -d= -f2- ); \
	if [ -z "$$CLOUDFLARE_API_TOKEN" ]; then $(call log_error,Missing CLOUDFLARE_API_TOKEN); exit 1; fi; \
	npx wrangler $(2) -c wrangler.toml)
endef

monitor-secrets: ## Set AWS secrets for all health monitors
	@$(call log_step,Setting AWS secrets for health monitors)
	@AWS_KEY=$$(aws configure get aws_access_key_id --profile $(AWS_PROFILE)); \
	AWS_SEC=$$(aws configure get aws_secret_access_key --profile $(AWS_PROFILE)); \
	if [ -z "$$AWS_KEY" ]; then $(call log_error,Could not retrieve AWS keys for profile $(AWS_PROFILE)); exit 1; fi; \
	for monitor in landing/monitor platform/monitor clawmore/monitor; do \
		$(call log_info,Updating secrets for $$monitor...); \
		echo "$$AWS_KEY" | $(call wrangler_cmd,$$monitor,secret put AWS_ACCESS_KEY_ID); \
		echo "$$AWS_SEC" | $(call wrangler_cmd,$$monitor,secret put AWS_SECRET_ACCESS_KEY); \
	done
	@$(call log_success,AWS secrets updated for all monitors)

deploy-monitors-all: monitor-secrets ## Deploy all health monitors (sets secrets first)
	@$(call log_step,Deploying all health monitors)
	@$(call wrangler_cmd,landing/monitor,deploy)
	@$(call wrangler_cmd,platform/monitor,deploy)
	@$(call wrangler_cmd,clawmore/monitor,deploy)
	@$(call log_success,All health monitors deployed)

deploy-landing-monitor: ## Deploy Cloudflare health monitor for landing
	@$(call log_step,Deploying landing health monitor)
	@$(call wrangler_cmd,landing/monitor,deploy)

deploy-clawmore-monitor: ## Deploy Cloudflare health monitor for ClawMore
	@$(call log_step,Deploying clawmore health monitor)
	@$(call wrangler_cmd,clawmore/monitor,deploy)

deploy-platform-monitor: ## Deploy Cloudflare health monitor for Platform
	@$(call log_step,Deploying platform health monitor)
	@$(call wrangler_cmd,platform/monitor,deploy)

monitor-logs-landing: ## Show landing monitor logs
	@cd landing/monitor && pnpm wrangler logs

monitor-logs-clawmore: ## Show clawmore monitor logs
	@cd clawmore/monitor && pnpm wrangler logs

monitor-logs-platform: ## Show platform monitor logs
	@cd platform/monitor && pnpm wrangler logs