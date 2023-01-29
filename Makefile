
.PHONY: all assets fonts

all: assets licenses/abcjs_plugin.LICENSE

assets: fonts js/abcjs-plugin-min.js

fonts: fonts/MusiQwik.woff2 fonts/LegniSaxophone.woff2

# Never got this to work - loaded and exported by hand via FontForge
fonts/%.woff2: sources/fonts/%.ttf
	fontforge -c "open('$<'); generate('$@')"

js/abcjs-plugin-min.js :
	curl -O "$@" https://paulrosen.github.io/abcjs/dist/$(@F)

source-assets/MusiQwik.ttf:
	curl -O "$@" http://luc.devroye.org/allgeyer/$(@F)

source-assets/LegniSaxophone.ttf:

licenses/abcjs_plugin.LICENSE :
	curl -O "$@" https://paulrosen.github.io/abcjs/dist/$(@F)

open:
	google-chrome index.html