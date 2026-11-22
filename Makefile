REMOTE     := $(shell git remote get-url origin 2>/dev/null)
REPO_NAME  := $(basename $(notdir $(REMOTE)))
BASE       := /$(REPO_NAME)/
DIST       := slides/dist
GIT_NAME   := $(shell git config user.name)
GIT_EMAIL  := $(shell git config user.email)

.PHONY: build publish

## Build the deck as a static site, served from https://<user>.github.io/<repo>/
## GitHub Pages serves 404.html for unknown paths: the copy lets the SPA handle deep links such as /12.
build:
	@test -n "$(REPO_NAME)" || { echo "No 'origin' remote: cannot derive the GitHub Pages base path."; exit 1; }
	cd slides && npx slidev build --base $(BASE) --out dist
	cp $(DIST)/index.html $(DIST)/404.html
	touch $(DIST)/.nojekyll

## Build, then force-push the result as the only commit of the gh-pages branch
publish: build
	rm -rf $(DIST)/.git
	cd $(DIST) \
		&& git init -q -b gh-pages \
		&& git add -A \
		&& git -c user.name="$(GIT_NAME)" -c user.email="$(GIT_EMAIL)" commit -q -m "Publish the deck" \
		&& git push -f "$(REMOTE)" gh-pages
	rm -rf $(DIST)/.git
	@echo "Published to the gh-pages branch of $(REMOTE)"
