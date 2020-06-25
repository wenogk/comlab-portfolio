let currentCommandTyped = "";
let commandContext = "";
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
    } else if(event.keyCode === 189) { // dash key "-"
     currentCommandTyped+="-";
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

function openUrl(url) {
  var win = window.open(url, '_blank');
  win.focus();
}
function printOnTerminal(txt="") {
  $('.new-output').removeClass('new-output');
  if(txt!="") {
    $('.terminal').append(`<p class="prompt output">${txt}</p><p class="prompt output new-output"></p>`);
  } else{
    $('.terminal').append(`<p class="prompt output new-output"></p>`);
  }
}

function runCommand(command) {

  let keepCommandContext = false;
  let c = command.replace(/\s+/g,' ').trim(); //remove any extra white space on either end of string
  let args = c.split(' ')
  if(c=="clear") {
    $('.terminal').html(`<p class="prompt output new-output"></p>`);
  } else if(c=="help") {
    printOnTerminal("▬▬ι═══════ﺤ Commands available are: projects, about, message, clear  -═══════ι▬▬");
  } else if(c=="projects") {
    var table = new AsciiTable('Projects')
table
  .setHeading('Name','Command for more info')
  .addRow('Convinience Store Tour', "a1")
  .addRow('Period.s comic', "a2")
  .addRow('Flight: A turbulent experience', "a3")
  .addRow('GTA NYU Abu Dhabi', "a4")

printOnTerminal("<br />"+ table.toString())

} else if(c.startsWith("open ") && args.length>1) {
  switch(args[1]) {
    case "a1":
      openUrl("https://wenogk.github.io/comlab-assignment-1/")
    default:
      printOnTerminal("Incorrect assignment name.")
  }
  printOnTerminal("Open the assignment " + args[1])
} else if(c=="") {
    printOnTerminal();
  } else {
    printOnTerminal(`Oops. That command is not recognized. Type in "help"`)
  }
  if(keepCommandContext) {
    commandContext = command;
  } else {
    commandContext = "";
  }
  currentCommandTyped = ""
  $(".new-output").get(0).scrollIntoView();
}
