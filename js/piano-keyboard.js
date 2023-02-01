const NORMATIVE_KEYS_NAMES = "C C♯ D E♭ E F F♯ G G♯ A B♭ B".split(" ")

// map
const ACCIDENTALS_TO_OFFSETS = {
  "𝄫": -2, // Double flat
  "♭♭": -2, // Two flats
  "bb": -2,
  "♭": -1, // Flat
  "b": -1,
  "°": -1, // Diminished
  "⁻": -1, // Superscript minus / minor
  "-": -1, // Minus - simple
  "": 0,
  "♮": 0,
  "⁺": 1, // Superscript plus / augmented
  "+": 1,
  "♯": 1, // Sharp
  "#": 1,
  "♯♯": 2, // Two sharps
  "##": 2,
  "𝄪": 2 // Double sharp
}

// Keys with an octave (`ko`s) are strings like "C3" or "F♯5"

const DEFAULTS = ["C3", "C5"]

const divmod = (x, y) => [Math.floor(x / y), x % y];

function splitKo(ko) {
  octave = parseInt(ko.slice(-1));
  raw_key = ko.slice(0, -1);
  offset = 0
  for (var k = raw_key; k.length > 1; k = k.slice(0, -1)) {
    accidental = k.slice(-1)
    offset += ACCIDENTALS_TO_OFFSETS[accidental]
  }
  key_index = NORMATIVE_KEYS_NAMES.indexOf(k)
  if (key_index == -1) {
    throw new RangeError(`key=${k} is not a valid key`)
  }
  [octave_adjustment, key_index] = divmod(key_index + offset, 12)
  octave += octave_adjustment

  key = NORMATIVE_KEYS_NAMES[key_index]
  return [key, octave]
}

function normaliseKo(ko) {
  [key, octave] = splitKo(ko)
  return key + octave
}

function getOctave(ko) {
  return parseInt(ko[ko.length - 1]);
}

function getKey(ko) {
  return ko.slice(0, -1);
}

function* build_keys(from, to) {
  let octave = getOctave(from)
  let key = getKey(from)
  let i = NORMATIVE_KEYS_NAMES.indexOf(key)
  if (i == -1) {
    throw new RangeError(`from=${from} is not a valid key`)
  }
  for(;octave <= 10;) {
    let key = NORMATIVE_KEYS_NAMES[i]
    let full_key = key + octave
    yield [full_key, key, octave]
    if (full_key == to) return
    i += 1
    if (i == NORMATIVE_KEYS_NAMES.length) {
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

  let prev_shim = null

  try {
    let full_key, key, octave
    for ([full_key, key, octave] of build_keys(from, to)) {
      let id = piano.id + '-' + full_key

      let shim_elmt = null

      let key_elmt = document.createElement("div");
      key_elmt.id = id
      key_elmt.classList.add("key")
      if (key.length == 1) {
        key_elmt.classList.add("key-natural")
      } else {
        key_elmt.classList.add("key-sharp")
      }
      key_elmt.classList.add("key-" + key)

      key_contents = document.createElement("div")
      key_contents.classList.add("key-contents")

      // `pad` is a place to put a fingure or a marker
      pad = document.createElement("div");
      pad.classList.add("key-pad")
      pad.id = id + "-pad"
      pad.innerHTML = "&nbsp;"

      // `text` comes under the pad, at the tip of the key
      text = document.createElement("div");
      text.classList.add("key-text")
      text.id = id + "-text"
      text.innerHTML = key + String.fromCodePoint(0x2080 + octave) // Subscript 0 through 9

      // Build key_elmt
      key_contents.appendChild(pad)
      key_contents.appendChild(text)
      key_elmt.appendChild(key_contents)

      if (key.length == 1) {
        // Append white keys the the piano
        shim_elmt = document.createElement("div");
        shim_elmt.classList.add("keyboard-shim")
        shim_elmt.appendChild(key_elmt)
        piano.appendChild(shim_elmt)
        prev_shim = shim_elmt
      } else {
        // Append to white key (for abs positioning)
        prev_shim.appendChild(key_elmt)
        prev_shim = null
      }
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

// Add text on "finger-pad" with red background
function add_dots(piano_ish, key_specs) {
  const piano = piano_from_piano_ish(piano_ish)
  for (const key_spec of key_specs.trim().split(/ +/)) {
    let ko, text
    [ko, text] = key_spec.split(":")
    if (text.length == 0) {
      text = ko
    } else if (text == "_") {
      text = "&nbsp;"
    }
    ko = normaliseKo(ko)
    // console.trace("key", i, "==", key)

    const elm = document.getElementById(piano.id + '-' + ko + "-pad")
    elm.innerHTML = text
    elm.style.background = "red"
    // add_dot(elm)
  }
}

// Reset "finger-pad"s
function reset(piano_ish) {
  piano = piano_from_piano_ish(piano_ish)
  for (let e of piano.getElementsByClassName("key-pad")) {
    e.innerHTML = "&nbsp;"
    e.style = 'transparent';
  }
}

// DEPRECATED
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

function animate_finger(piano_ish, key_specs) {
  piano = piano_from_piano_ish(piano_ish)

  let final_positions = []

  for (const key_pair of key_specs.trim().split(/ +/)) {
    let [from_and_text, to] = key_pair.split("~")
    let [from, text] = from_and_text.split(":")
    if (text == "_") {
      text = "&nbsp;"
    }
    from = normaliseKo(from)
    to = normaliseKo(to)
    const from_elmt = document.getElementById(piano.id + '-' + from + "-pad")
    const to_elmt = document.getElementById(piano.id + '-' + to + "-pad")
    const from_pos = from_elmt.getBoundingClientRect()
    const to_pos = to_elmt.getBoundingClientRect()

    const piano_pos = piano.getBoundingClientRect()

    from_pos_left = from_pos.left - piano_pos.left
    from_pos_top = from_pos.top - piano_pos.top
    to_pos_left = to_pos.left - piano_pos.left
    to_pos_top = to_pos.top - piano_pos.top

    let finger = document.createElement("div")
    finger.innerHTML = text
    finger.classList.add("finger")
    finger.style.left = from_pos_left + "px"
    finger.style.top = from_pos_top + "px"
    finger.style.width = from_pos.width + "px"
    finger.style.height = from_pos.height + "px"
    piano.appendChild(finger)
    final_positions.push([finger, to_pos_left, to_pos_top])
  }

  setTimeout(() => {
    for (let [finger, to_pos_left, to_pos_top] of final_positions) {
      finger.style.left = to_pos_left + "px"
      finger.style.top = to_pos_top + "px"
    }
  }, 3)
}