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

// Main piano keyboard builder
function buildKeyBoard(piano) {
  piano.innerHTML = ""

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

function add_dots(piano, key_spec) {
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

function reset(root = document) {
  elmts = root.getElementsByClassName("key-pad")
  for (i in elmts) {
    e = elmts[i]
    e.innerHTML = "&nbsp;"
    e.style = 'transparent';
  }
}

function change_key_text_colour(key_spec) {
  KEYS = key_spec.split(" ")
  for (i in KEYS) {
    key = KEYS[i]
    console.trace(key)
    console.trace("\n")
    elm = document.getElementById(key);
    color = "red"
    // if (elm.classList.contains("key-sharp")) {
    //   color = "yellow"
    // }
    elm.style.color = color
    // ⬤
  }
}
