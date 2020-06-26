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
    printOnTerminal("Commands available are: projects, about, message, clear");
  } else if(c=="projects") {
    var table = new AsciiTable('Comlab Projects')
table
  .setHeading('Name','Command for more info')
  .addRow('Convinience Store Tour', "p1")
  .addRow('Period.s comic', "p2")
  .addRow('Flight: A turbulent experience', "p3")
  .addRow('GTA NYU Abu Dhabi', "p4")

printOnTerminal("<br />"+ table.toString())

} else if(c.startsWith("open ") && args.length>1) {
  switch(args[1]) {
    case "p1":
      openUrl("https://wenogk.github.io/comlab-assignment-1/")
      printOnTerminal()
      break;
    case "p2":
      openUrl("https://wenogk.github.io/comic-strip/")
      printOnTerminal()
      break;
    case "p3":
      openUrl("https://wenogk.github.io/sound-journey")
      printOnTerminal()
      break;
    case "p4":
      openUrl("https://wenogk.github.io/gta-nyuad")
      printOnTerminal()
      break;
    default:
      printOnTerminal("Incorrect assignment name. Options are p1, p2, p3 or p4.")
  }

} else if((c.startsWith("doc ") || c.startsWith("docs ")) && args.length>1) {
  switch(args[1]) {
    case "p1":
      openUrl("https://github.com/wenogk/comlab-assignment-1/")
      printOnTerminal()
      break;
    case "p2":
      openUrl("https://github.com/wenogk/comic-strip/")
      printOnTerminal()
      break;
    case "p3":
      openUrl("https://github.com/wenogk/sound-journey")
      printOnTerminal()
      break;
    case "p4":
      openUrl("https://github.com/wenogk/gta-nyuad")
      printOnTerminal()
      break;
    default:
      printOnTerminal("Incorrect assignment name. Options are p1, p2, p3 or p4.")
  }

} else if(c=="about") {
    printOnTerminal(`My name is Romeno Wenogk Fernando. I'm Sri Lankan and currently studying at New York University Abu Dhabi.`);
  } else if(c=="p1") {
    printOnTerminal(`A student life tours website with a tour of the convinience store. Type in "open p1" to see the project live or "doc p1" to see the documentation`)
  } else if(c=="p2") {
    printOnTerminal(`A comic that deals with the taboo of menstruation. Type in "open p2" to see the project live or "doc p2" to see the documentation`)
  } else if(c=="p3") {
    printOnTerminal(`A turbulent sound journey in a plane. Type in "open p3" to see the project live or "doc p3" to see the documentation`)
  } else if(c=="p4") {
    printOnTerminal(`Grand Theft Auto themed NYUAD experience. Type in "open p4" to see the project live or "doc p4" to see the documentation`)
  } else if(c=="message") {
    printOnTerminal("Not implemented yet.");
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
