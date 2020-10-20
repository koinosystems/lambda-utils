package/publish:
	$(info Publishing package)
	npm version $$(current_version.sh) --git-tag-version=false
	npm i
	npm run build
	echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
	cp README.md dist/
	cp .npmrc dist/
	cp package.json dist/
	sed -i.bak 's|dist/index|index|g' package.json && rm package.json.bak && :
	cd dist/ && npm publish

pipeline/qa-audit:
	npm audit --prod --audit-level=moderate

pipeline/qa-lint:
	npm i
	npm run lint

pipeline/qa-typecheck:
	npm i
	npm run typecheck
