.PHONY: all

all: build/lithium-language-support.vsix
	@echo > /dev/null

build/lithium-language-support.vsix: syntaxes/lithium.tmLanguage.json \
	lithium-configuration.json \
	syntaxes/lithium-asm.tmLanguage.json \
	lithium-asm-configuration.json \
	package.json \
	extension.js \
	hoverProvider.js \
	definitionProvider.js
	@mkdir -p build
	@npm install > /dev/null
	@npm run package > /dev/null

clean:
	rm -rf build
	rm -rf node_modules
	rm -rf package-lock.json