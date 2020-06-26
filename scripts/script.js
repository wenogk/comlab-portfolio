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
  // var win = window.open(url, '_blank');
  // win.focus();
  document.location.href = url;
}
function printOnTerminal(txt="",noBefore = false) {
  $('.new-output').removeClass('new-output');
  if(txt!="") {
    $('.terminal').append(`<p class="${noBefore ? "promptNoBefore" : "prompt"} output">${txt}</p><p class="${noBefore ? "promptNoBefore" : "prompt"} output new-output"></p>`);
  } else{
    $('.terminal').append(`<p class="${noBefore ? "promptNoBefore" : "prompt"} output new-output"></p>`);
  }
}

function runCommand(command) {

  let keepCommandContext = false;
  let c = command.replace(/\s+/g,' ').trim(); //remove any extra white space on either end of string
  let args = c.split(' ')
  if(c=="clear") {
    $('.terminal').html(`
      <div class="container d-flex h-100">
      <div class="row ">
      <div class="col-auto promptNoBefore justify-content-center align-self-center" style="font-size: 4px">
        <pre style="color: #1ff042; ">
          ${ME}
        </pre>
      </div>
      <div class="col promptNoBefore align-middle justify-content-center align-self-center">Hello, my name is Romeno! Type in, "help" and hit enter to get the available commands</div>
      </div>
      </div>
      </div>
    <p class="prompt output new-output"></p>`);
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
    printOnTerminal(`
      <div class="col-auto" style="font-size: 5px">
      <pre style="color: grey; ">
        ${ME}
      </pre>
      </div>
      Not implemented yet.`);
  } else if(c=="p1") {
    printOnTerminal(`
      <div class="container d-flex h-100">
      <div class="row">
      <div class="col-auto promptNoBefore justify-content-center align-self-center" style="font-size: 5px">
        <pre style="color: #1ff042; ">
          ${NYU_TORCH}
        </pre>
      </div>
      <div class="col promptNoBefore align-middle justify-content-center align-self-center">A student life tours website with a tour of the convinience store. The idea of the website is to keep it as close as possible to the NYU guidelines and invite viewers to sign up for tours on campus. <br /><br />Type in "open p1" to see the project live or "doc p1" to see the documentation</div>
      </div>
      </div>
      `, true)
    printOnTerminal()
  } else if(c=="p2") {
    printOnTerminal(`A comic that deals with the taboo of menstruation. Type in "open p2" to see the project live or "doc p2" to see the documentation`)
  } else if(c=="p3") {
    printOnTerminal(`A turbulent sound journey in a plane. Type in "open p3" to see the project live or "doc p3" to see the documentation`)
  } else if(c=="p4") {
    printOnTerminal(`
      <div class="container d-flex h-100">
      <div class="row">
      <div class="col-auto promptNoBefore justify-content-center align-self-center" style="font-size: 5px">
        <pre style="color: #1ff042; ">
          ${GTA}
        </pre>
      </div>
      <div class="col promptNoBefore align-middle justify-content-center align-self-center">Grand Theft Auto themed NYUAD experience. <br/><br/> Type in "open p4" to see the project live or "doc p4" to see the documentation</div>
      </div>
      </div>
      `, true)
    printOnTerminal()
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

runCommand("clear");
