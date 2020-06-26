let currentCommandTyped = "";
let commandContext = "Enter Username > ";
let commandHistory = [];
let commandHistoryMarker = 0;
let username = "";
let password = "";
let authorized = false;
let enterUsernameMode = true;
let enterPasswordMode = false;

function $(selector) { //to remove the jQuery dependancy from the code with minimal changes, I rewrote only the functions I needed
return document.querySelector(selector);
}

HTMLElement.prototype.text = function(text) {
  this.innerHTML = text;
};

HTMLElement.prototype.append = function(text) {
  this.innerHTML = this.innerHTML + text;
};

HTMLElement.prototype.html = function(html) {
  this.innerHTML = html;
};

HTMLElement.prototype.removeClass = function(remove) {
    var newClassName = "";
    var i;
    var classes = this.className.split(" ");
    for(i = 0; i < classes.length; i++) {
        if(classes[i] !== remove) {
            newClassName += classes[i] + " ";
        }
    }
    this.className = newClassName;
}
function toHidden(password) {
  return "*".repeat(password.length);
}
document.onkeydown = function(e) { //key press event listener for terminal typing
    e = e || window.event;
    if (e.ctrlKey || e.metaKey) { return;} //to ignore when cmd+r / ctrl+r is pressed
    console.log(event.keyCode + " pressed!")
    let isMaxCharacters = ((!authorized && currentCommandTyped.length<12) || authorized);
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    let letter = String.fromCharCode(charCode).toLowerCase(); //char number to actual letter which is then forced to lowercase so even upper case cheat codes r good
    if (event.keyCode >= 48 && event.keyCode <= 57) { //if number 0-9
      if(isMaxCharacters) currentCommandTyped+= String(event.keyCode-48);
      if(!enterPasswordMode) $(".new-output").text(currentCommandTyped)
      else $(".new-output").text(toHidden(currentCommandTyped))
    } else if (event.keyCode >= 65 && event.keyCode <= 90) { //if letter a-z
      if(isMaxCharacters) currentCommandTyped+=letter;
      if(!enterPasswordMode) $(".new-output").text(currentCommandTyped)
      else $(".new-output").text(toHidden(currentCommandTyped))
    } else if(event.keyCode === 189) { // dash key "-"
      if(isMaxCharacters)currentCommandTyped+="-";
      if(!enterPasswordMode) $(".new-output").text(currentCommandTyped)
      else $(".new-output").text(toHidden(currentCommandTyped))
    } else if(event.keyCode === 32) { // space bar hit
      console.log("space")
      if(!enterUsernameMode && isMaxCharacter) currentCommandTyped+=" ";
      if(!enterPasswordMode) $(".new-output").text(currentCommandTyped)
      else $(".new-output").text(toHidden(currentCommandTyped))
    } else if(event.keyCode === 8) { // back space hit
      currentCommandTyped = currentCommandTyped.slice(0,-1); //remove last character
      if(!enterPasswordMode) $(".new-output").text(currentCommandTyped)
      else $(".new-output").text(toHidden(currentCommandTyped))
    } else if(event.keyCode === 13) { // enter key hit
      console.log(`authorized: ${authorized}, usernameMode: ${enterUsernameMode}, passwordMode: ${enterPasswordMode}`)
      if(!authorized) {
        authorization(currentCommandTyped);
      } else {
        runCommand(currentCommandTyped);
      }
    } else if (event.keyCode === 38) { //up arrow key for back
      e.preventDefault();
      if(commandHistoryMarker>0){
        commandHistoryMarker-=1;
        currentCommandTyped = commandHistory[commandHistoryMarker]
        $(".new-output").text(currentCommandTyped);
      }
    } else if (event.keyCode === 40) { // down arrow key for front
      e.preventDefault();
      if(commandHistoryMarker<commandHistory.length-1){
        commandHistoryMarker+=1;
        currentCommandTyped = commandHistory[commandHistoryMarker]
        $(".new-output").text(currentCommandTyped);
      } else if(commandHistoryMarker == commandHistory.length-1 && currentCommandTyped==commandHistory[commandHistory.length-1]) {
        currentCommandTyped = "";
        $(".new-output").text(currentCommandTyped);
      }
    } //38 40 down)
};

function openUrl(url) {
  var win = window.open(url, '_blank');
  if(!win || win.closed || typeof win.closed=='undefined') { //if popups are blocked in user system change current url
    document.location.href = url;
  } else {
    win.focus();
  }
}
function printOnTerminal(txt="",noBefore = false) {
  $('.new-output').removeClass('new-output');
  if(txt!="") {
    $('.terminal').append(`<p class="${noBefore ? "promptNoBefore" : "prompt"} output" command-context="${commandContext}">${txt}</p><p class="${noBefore ? "promptNoBefore" : "prompt"} output new-output" command-context="${commandContext}"></p>`);
  } else{
    $('.terminal').append(`<p class="${noBefore ? "promptNoBefore" : "prompt"} output new-output" command-context="${commandContext}"></p>`);
  }
}

function authorization(value) {
  if(enterUsernameMode) {
    username = value;
    enterUsernameMode = false;
    enterPasswordMode = true;
    commandContext = "Set password: ";
    currentCommandTyped = "";
    printOnTerminal();
  } else if(enterPasswordMode) {
    password = value;
    const user = {
    username: username,
    password: password,
    }
    window.localStorage.setItem('user', JSON.stringify(user));
    enterPasswordMode = false;
    authorized = true;
    commandContext = username + "@portfolio > ";
    $("title").html("ssh " + username + "@portfolio")
    currentCommandTyped = "";
    runCommand("clear");
  }
}

function runCommand(command , saveToHistory = true) {
  let commandValid = true;
  let keepCommandContext = false;
  let c = command.replace(/\s+/g,' ').trim(); //remove any extra white space on either end of string
  let args = c.split(' ')
  if(c=="clear") {
    $('.terminal').html(`
      <div class="container d-flex h-100">
      <div class="row ">
      <div class="col-md-3 promptNoBefore justify-content-center align-self-center" style="font-size: 4px">
        <pre style="color: #1ff042; ">${ME}</pre>
      </div>
      <div class="col promptNoBefore align-middle justify-content-center align-self-center">Hello, my name is Romeno! Type in, "help" and hit enter to get the available commands</div>
      </div>
      </div>
      </div>
    <p class="prompt output new-output" command-context="${commandContext}"></p>`);
  } else if(c=="help") {
    printOnTerminal("Commands available are: projects, about, message, clear, logout. As you type in commands you can reuse your previous commands by using the up and down arrow.");
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
    printOnTerminal(`Not implemented yet.`);
  } else if(c=="p1") {
    printOnTerminal(`
      <div class="container d-flex h-100">
      <div class="row">
      <div class="col-md-3 promptNoBefore justify-content-center align-self-center text-center" style="font-size: 5px; min-width: 300px;">
        <pre style="color: #1ff042; ">${NYU_TORCH}</pre>
      </div>
      <div class="col promptNoBefore align-middle justify-content-center align-self-center">A student life tours website with a tour of the convinience store. The idea of the website is to keep it as close as possible to the NYU guidelines and invite viewers to sign up for tours on campus. <br /><br />Type in "open p1" to see the project live or "doc p1" to see the documentation</div>
      </div>
      </div>
      `, true)
    printOnTerminal()
  } else if(c=="p2") {
    printOnTerminal(`
      <div class="container d-flex h-100">
      <div class="row">
      <div class="col-md-3 promptNoBefore justify-content-center align-self-center text-center" style="font-size: 5px; min-width: 300px;">
        <pre style="color: #1ff042; ">${PERIODS}</pre>
      </div>
      <div class="col promptNoBefore align-middle justify-content-center align-self-center">A comic that deals with the taboo of menstruation. <br /><br />Type in "open p2" to see the project live or "doc p2" to see the documentation</div>
      </div>
      </div>
      `, true)
    printOnTerminal()
  } else if(c=="p3") {
      printOnTerminal(`
      <div class="container d-flex">
      <div class="row">
      <div class="col-md-3 promptNoBefore justify-content-center align-self-center text-center" style="font-size: 5px; min-width: 300px;">
        <pre style="color: #1ff042; ">${PLANE}</pre>
      </div>
      <div class="col promptNoBefore align-middle justify-content-center align-self-center">A turbulent sound journey in a plane. <br/><br/> Type in "open p3" to see the project live or "doc p3" to see the documentation</div>
      </div>
      </div>
      `, true)
    printOnTerminal()
  } else if(c=="p4") {
    printOnTerminal(`
      <div class="container d-flex">
      <div class="row">
      <div class="col-md-3 promptNoBefore justify-content-center align-self-center text-center" style="font-size: 5px; min-width: 300px;">
        <pre style="color: #1ff042; ">${GTA}</pre>
      </div>
      <div class="col promptNoBefore align-middle justify-content-center align-self-center">Grand Theft Auto themed NYUAD experience. <br/><br/> Type in "open p4" to see the project live or "doc p4" to see the documentation</div>
      </div>
      </div>
      `, true)
    printOnTerminal()
  } else if(c=="message") {
    printOnTerminal("Not implemented yet.");
  } else if(c=="logout") {
    window.localStorage.clear();
    location.reload();
  } else if(c=="") {
    commandValid = false;
    printOnTerminal();
  } else {
    commandValid = false;
    printOnTerminal(`Oops. That command is not recognized. Type in "help"`)
  }
  if(commandValid && (saveToHistory)) {
    if(commandHistory[commandHistory.length-1]!=c) {
      let len = commandHistory.length;
      let maxHistoryValues = 4;
      if(len > maxHistoryValues){
        commandHistory.splice( 0, len - maxHistoryValues);
      }
      commandHistory.push(c)
    }
  }
  commandHistoryMarker = commandHistory.length;
  currentCommandTyped = ""
  $(".new-output").scrollIntoView(); //make screen scroll down as new outputs come on the terminal
}

if(window.localStorage.getItem('user')!== null) { //if user already logged in, set the variables accordingly
  enterUsernameMode = false;
  enterPasswordMode = false;
  authorized = true;
  let data = JSON.parse(window.localStorage.getItem('user'));
  username = data.username;
  password = data.password;
  commandContext = username + "@portfolio > ";
  currentCommandTyped = "";
  $("title").html("ssh " + username + "@portfolio")
}

runCommand("clear", false);
