const KEYS = "C C♯ D E♭ E F F♯ G G♯ A B♭ B".split(" ")

// Keys with an octave (`ko`s) are strings like "C3" or "F♯5"

const DEFAULTS = ["C3", "C5"]

function getOctave(ko) {
  return parseInt(ko[ko.length - 1]);
}

function getKey(ko) {
  return ko.slice(0, -1);
}

function* build_keys(from, to) {
  let octave = getOctave(from)
  let key = getKey(from)
  let i = KEYS.indexOf(key)
  if (i == -1) {
    throw new RangeError(`from=${from} is not a valid key`)
  }
  for(;octave <= 10;) {
    key = KEYS[i] + octave
    yield key
    if (key == to) return
    i += 1
    if (i == KEYS.length) {
      i = 0
      octave += 1
    }
  }
  throw new RangeError(`to=${to} is not a valid key`)
}

// `piano_ish` can be a piano element, a sibling or close-cousin, of an id
// This allows portable onclick actions that simply use `this` as a parameter
function piano_from_piano_ish(piano_ish) {
  if (piano_ish instanceof String) {
    piano = document.getElementById(piano_ish)
  } else if (piano_ish instanceof HTMLElement) {
    if ("piano-keyboard" in piano_ish.classList) {
      piano = piano_ish
    } else {
      for(;;) {
        piano = piano_ish.getElementsByClassName("piano-keyboard")
        if (piano.length == 1) {
          piano = piano[0]
          break
        }
        if (piano.length > 1) {
          throw Error("Too many pianos found")
        }
        piano_ish = piano_ish.parentElement
        if (piano_ish === null) {
          throw Error("No piano found")
        }
      }
    }
  }
  return piano
}

// Main piano keyboard builder
function buildKeyBoard(piano_ish) {

  piano = piano_from_piano_ish(piano_ish)
  piano.innerHTML = ""

  // Datasets, see: https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
  let dataset = piano.dataset
  let from = dataset?.firstKey || DEFAULTS[0]
  let to = dataset?.lastKey || DEFAULTS[1]

  try {
    for (ko of build_keys(from, to)) {
      k = getKey(ko)
      id = piano.id + '-' + ko

      supr = document.createElement("div");
      supr.id = id
      supr.classList.add("key")
      if (k.length == 1) {
        supr.classList.add("key-natural")
      } else {
        supr.classList.add("key-sharp")
      }
      supr.classList.add("key-" + k)

      key_contents = document.createElement("div")
      key_contents.classList.add("key-contents")

      pad = document.createElement("div");
      pad.classList.add("key-pad")
      pad.id = id + "-pad"
      pad.innerHTML = "&nbsp;"

      text = document.createElement("div");
      text.classList.add("key-text")
      text.id = id + "-text"
      text.appendChild(document.createTextNode(k)) // Main text
      ov = document.createElement("sub");
      ov.innerHTML = getOctave(ko)
      text.appendChild(ov)
      
      key_contents.appendChild(pad)
      key_contents.appendChild(text)
      supr.appendChild(key_contents)
      piano.appendChild(supr)
    }
  } catch (e) {
    piano.innerHTML = `<div class="bar error">${e}</div>`
  }
}


// Build all keyboards in document
function initPianos() {
  for (piano of document.getElementsByClassName("piano-keyboard")) {
    buildKeyBoard(piano)
  }
} 


// Once load is completed, build all keyboards
window.addEventListener("load", initPianos, true)


// Manipulators

function add_dots(piano_ish, key_spec) {
  piano = piano_from_piano_ish(piano_ish)
  for (key of key_spec.replace("#", "♯").replace("b", "♭").split(" ")) {
    parts = key.split(":")
    key = parts[0]
    if (parts.length > 1) {
      text = parts[1]
    } else {
      text = key
    }
    if (text == "_") {
      text = "&nbsp;"
    }
    // console.trace("key", i, "==", key)
    elm = document.getElementById(piano.id + '-' + key + "-pad")
    elm.innerHTML = text
    elm.style.background = "red"
    // add_dot(elm)
  }
}

function reset(piano_ish) {
  piano = piano_from_piano_ish(piano_ish)
  for (let e of piano.getElementsByClassName("key-pad")) {
    e.innerHTML = "&nbsp;"
    e.style = 'transparent';
  }
}

function change_key_text_colour(piano_ish, key_spec) {
  piano = piano_from_piano_ish(piano_ish)
  for (let key_name of key_spec.split(" ")) {
    // console.trace(key_name)
    // console.trace("\n")
    let key_elmt = piano.getElementById(piano_ish + '-' + key_name);
    color = "red"
    // if (elm.classList.contains("key-sharp")) {
    //   color = "yellow"
    // }
    key_elmt.style.color = color
    // ⬤
  }
}
