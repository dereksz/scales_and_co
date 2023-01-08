

build-assets/MusiQwik.ttf:
	curl -O "$@" http://luc.devroye.org/allgeyer/MusiQwik.ttf

assets/MusiQwik.woff2: build-assets/MusiQwik.ttf
	fontforge -c "open('$<'); generate('$@')"
