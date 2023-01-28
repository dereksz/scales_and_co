

function buildKeyBoard(piano) {
  var octaves = [3,4,5]
  var keys = "C C♯ D E♭ E F F♯ G G♯ A B♭ B".split(" ")
  for (o in octaves) {
    o = octaves[o]
    for (k in keys) {
      k = keys[k]

      id = k + o

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
      text.appendChild(document.createTextNode(k)) // Main text
      ov = document.createElement("sub");
      ov.innerHTML = o // Octave
      text.appendChild(ov)
      
      key_contents.appendChild(pad)
      key_contents.appendChild(text)
      supr.appendChild(key_contents)
      piano.appendChild(supr)

      if (id == "C5") {
        break
      }
    }
  }
}

function pianoInit() {
  for (piano in document.getElementsByClassName("piano-keybopard")) {

  }
} 

window.addEventListener("load", pianoInit, true)

