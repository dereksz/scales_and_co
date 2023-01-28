# Design docs

## The Piano Keyboard

The placement of the keyboard should marked using HTML such as
```html
<figure
  id="keyboard-1"
  class="piano-keyboard"
  data-first-key="C3"
  data-last-key="C5">
  Placeholder - piano keyboard will be built here dynamicly
</figure>
```

The creation of the ceyboard is then carried out by the
JavaScript function `initPianos` in `piano-keyboard.js`.