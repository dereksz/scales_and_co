
function abcNotes(src, tgt) {
  ABCJS.renderAbc(
    tgt,
    "X:1\nL:1/4\nK:none clef=none\n|" + src + "|",
    {
      pageheight: "5cm",
      pagewidth: "2cm",
      topmargin: 0,
      botmargin: 0,
      leftmargin: 0,
      rightmargin: 0,
      staffwidth: 50 
    }
  )
}

function setViewBox(selector) {
  var el = document.getElementById(selector);
  var svgElement = el.firstChild
  const {
    x,
    y,
    width,
    height,
  } = svgElement.getBBox();
  const viewBoxValue = [x+5, y, width, height].join(' ');
  svgElement.setAttribute('viewBox', viewBoxValue);
}

function abcNotesConvert() {
  document.querySelectorAll('.abc-notes').forEach(block=>{
    abcNotes(block.textContent, block.id)
    // setViewBox(block.id)
  })
}

