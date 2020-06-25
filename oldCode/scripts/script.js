var markup = document.documentElement.innerHTML;
function getTextWidth(text, font) { //https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

function letterRepeaterFullWidth(letter) { //function I wrote to repeat a letter for the maximum width of the viewport
  let maxWidth = $(window).width();
  let currentWidth = 0;
  let currentNumberOfLetters = 0;
  while(maxWidth>currentWidth) {
    currentNumberOfLetters+=1;
    currentWidth = getTextWidth(letter.repeat(currentNumberOfLetters), "bold 12px arial")
  }
  return letter.repeat((currentNumberOfLetters-1));
}
function header(custom = false,textVal = '') {
  let array = ["romeno","comlab","nyuad","-","©","0","%",":-)","▒"]
  const text =(custom) ? textVal : array[Math.floor(Math.random() * array.length)];
  return `<center>${letterRepeaterFullWidth(text)}<br/> | Item | Item 2 | Item 3 | <br/> ${letterRepeaterFullWidth(text)}</center>`;
}
function resize(element) { //function I wrote to rescale an element if it exceeds the viewport size
  let availableWidth = $(window).width();
  let availableHeight = $(window).height();
  let contentWidth = $(element).width();
  let contentHeight = $(element).height();
  let scale = Math.min(availableWidth / contentWidth, availableHeight / contentHeight ); //https://twitter.com/slides/status/666967622764896257
  console.log(scale)
  $(element).css({scale: scale});
}

$(window).on('resize', function () {
  $(".header").html(header());
  resize(".name");
    });

$(".header").html(header(true,"-resize-me-"));

gsap.to(".plane", {duration: 5, left: 300, bottom: 200, rotation: -270})
