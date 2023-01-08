// Array storing all existing notes on the piano
const notes = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];

// Object storing chord types and its notes position
const chordScheme = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dim: [0, 3, 6],
};

// Function altering the notes array to change the root note
const getNotesFromRoot = (rootNote) => {
  let slicePivot = notes.indexOf(rootNote.toLowerCase()); // get the position of new root note
  if (slicePivot === -1) { // return empty array if root note doesn't exists
    return [];
  }

  const fromPivot = notes.slice(slicePivot, notes.length); // get part of array fom new root note to the end of array
  const toPivot = notes.slice(0, slicePivot); // get part of array fom beginning to new root note

  return [...fromPivot, ...toPivot]; // return new array combining fromPivot and toPivot together
};

// Function returning chord notes
const getChord = (rootNote, chordType) => {
  const notesFromRoot = getNotesFromRoot(rootNote); // get array of notes, beginning from the rootNote value

  if (notesFromRoot.length > 0 && chordScheme[chordType]) {
    return chordScheme[chordType].map((noteIndex) => notesFromRoot[noteIndex]); // map selected chord type array into array of note names 
  }

  return [];
};