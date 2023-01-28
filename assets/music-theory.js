class Note {
  constructor(pitch, octave) {
    this.pitch = pitch
    this.ocatve = octave
  }

  get natural() {
    return length(this.pitch) == 1
  }

  get sharp() {
    return length(this.pitch) == 2
  }

  get full_note() {
    return this.pitch + this.octave
  }

  get as_html() {
    octave = document.createElement("sub");
    octave.innerHTML = this.ocatve

    span = document.createElement("span");
    full_note = this.full_note
    span.id = full_note
    span.classList.add("key")
    if (self.natural) {
      span.classList.add("key-natural")
    } else {
      span.classList.add("key-sharp")
    }
    span.classList.add("key-" + full_note)

    span.appendChild(document.createTextNode(this.pitch))
    span.appendChild(ocatve)

    return span
  }
}




classic_scale = "TTsTTTs" // Tone Tone semi-tone, ...
// We'll try to code for the equivalent WWhWWWh (Whole / half) variant too; we'll make case insensitive
relative_minor_scale = "TsTTsTT" // Staring on the vi of the relative major scale

left_rotations = [
  "Ionian", // White notes starting on C
  "Dorian", // White notes starting on D == classic_scale "rotated left by 1"
  "Phrygian", // …starting on E
  "Lydian", // …starting on F
  "Mixolydian", // …starting on G
  "Aeolian", // …starting on A == relative minor
  "Locrian", // Starting on B 
  /* "The Locrian mode is traditionally considered theoretical rather than practical 
     because the triad built on the first scale degree is diminished"
     https://en.wikipedia.org/wiki/Mode_(music)#Summary
  */
]

// https://www.studybass.com/lessons/harmony/what-are-major-scale-diatonic-chords/
/* 
When chords are described by their number position in the scale, we use Roman
numerals to describe them: I, ii, iii, IV, V, vi and vii. When we study chords
and number them this way, it is called harmonic analysis.

Notice the pattern of uppercase and lowercase Roman numerals. Uppercase numerals represent 
major-type chords, and lowercase numerals are used for minor- and diminished-type chords.
*/ 
classic_naming = "I ii iii IV V vi vii°".split(" ")