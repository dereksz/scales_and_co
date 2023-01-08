
.PHONY: all assets fonts

all: assets licenses/abcjs_plugin.LICENSE

assets: fonts assets/abcjs-plugin-min.js

fonts: assets/MusiQwik.woff2 assets/LegniSaxophone.woff2

assets/%.woff2: build-assets/%.ttf
	fontforge -c "open('$<'); generate('$@')"

assets/abcjs-plugin-min.js :
	curl -O "$@" https://paulrosen.github.io/abcjs/dist/$(@F)

build-assets/MusiQwik.ttf:
	curl -O "$@" http://luc.devroye.org/allgeyer/$(@F)

build-assets/LegniSaxophone.ttf:

licenses/abcjs_plugin.LICENSE :
	curl -O "$@" https://paulrosen.github.io/abcjs/dist/$(@F)

