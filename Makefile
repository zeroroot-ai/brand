# ============================================================================
# @zeroroot-ai/brand — uniform Makefile contract
# ============================================================================
# Implements the org-wide target contract (gibson#171 slice 1.4, enforced by
# the makefile-contract workflow in zeroroot-ai/.github):
#
#     make build | test | check
#
# This package is dependency-free (plain Node scripts, no install step), so
# there is no bootstrap target: a clean checkout with Node 20+ just works.
# `make check` mirrors .github/workflows/ci.yml exactly (build then test).
# ============================================================================

.PHONY: all build test check clean help

all: check ## Default: run the full CI-equivalent gate

build: ## Compile design tokens -> dist/ (ESM + CJS + d.ts + CSS)
	node scripts/build.mjs

test: ## Run the node:test token suite
	node --test src/__tests__/tokens.test.mjs

check: build test ## CI-equivalent gate (mirrors ci.yml: build then test)

clean: ## Remove build output
	rm -rf dist

help: ## List available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  %-12s %s\n", $$1, $$2}'
