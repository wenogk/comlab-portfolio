let currentCommandTyped = "";
document.onkeydown = function(e) { //key press event listener for terminal typing
    e = e || window.event;
    console.log(event.keyCode + " pressed!")
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    let letter = String.fromCharCode(charCode).toLowerCase(); //char number to actual letter which is then forced to lowercase so even upper case cheat codes r good
    if (event.keyCode >= 48 && event.keyCode <= 57) { //if number 0-9
      currentCommandTyped+= String(event.keyCode-48);
      $(".new-output").text(currentCommandTyped)
    } else if (event.keyCode >= 65 && event.keyCode <= 90) { //if letter a-z
      currentCommandTyped+=letter;
      $(".new-output").text(currentCommandTyped)
    } else if(event.keyCode === 32) { // space bar hit
      console.log("space")
      currentCommandTyped+=" ";
      $(".new-output").text(currentCommandTyped)
    } else if(event.keyCode === 8) { // back space hit
      currentCommandTyped = currentCommandTyped.slice(0,-1); //remove last character
      $(".new-output").text(currentCommandTyped)
    } else if(event.keyCode === 13) { // enter key hit
      runCommand(currentCommandTyped);
    }
};

function printOnTerminal(txt="", newPrompt = true) {
  $('.new-output').removeClass('new-output');
  $('.terminal').append(`<p class="prompt output ${(newPrompt) ? "new-output" : ""}">${txt}</p>`);
}

function runCommand(command) {
  let c = command.replace(/\s+/g,' ').trim(); //remove any extra white space on either end of string
  if(c=="clear") {
    $('.terminal').html(`<p class="prompt output new-output"></p>`);
  } else if(c=="") {
    printOnTerminal();
  } else if(c=="") {
    printOnTerminal();
  } else {
    printOnTerminal(`Oops. That command is not recognized. Type in "help"`, false)
    printOnTerminal();
  }
  currentCommandTyped = ""
  $(".new-output").get(0).scrollIntoView();
}
