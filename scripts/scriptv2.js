let currentCommandTyped = "";
let commandContext = "Enter Username > ";
let commandHistory = [];
let commandHistoryMarker = 0;
let username = "";
let password = "";
let authorized = false;
let enterUsernameMode = true;
let enterPasswordMode = false;
let enterMessageMode = false;
let arrowKeyHelpMessageCounter = 0;
class FileTreeNode {
  constructor(value, commands) {
    this.name = value;
    this.subfiles = [];
    this.availableCommands = [...commands,"out","list","clear","logout","help",""];
  }
  listAvailableCommands() {
    let pretty = []
    for (let x in this.availableCommands) {
      if(this.availableCommands[x] != "" && this.availableCommands[x] != "help") {
        if(!(this.name == "portfolio" && this.availableCommands[x] == "out")) {
          pretty.push(this.availableCommands[x])
        }
      }
    }
    return pretty.join(', ');
  }

  listSubfiles() {
    let f = [];
    for (let x in this.subfiles) {
      f.push(this.subfiles[x].name)
    }
    return f.join(', ');
  }

  isValidFileTreeCommand(command) {
    return this.availableCommands.includes(command);
  }

  returnSubfile(fileName) {
    for (let x in this.subfiles) {
      if(this.subfiles[x].name === fileName) {
        return this.subfiles[x];
      }
    }
    return this;
  }

  doesSubfileExist(fileName) {
    for (let x in this.subfiles) {
      if(this.subfiles[x].name === fileName) {
        return true;
      }
    }
    return false;
  }

}
//portfolio, "p1"
//projects, "p1"
function getParentFileTreeNode(file) { //recursive function to get parent file from sub file
  function recursiveSearch(fileObject, name) {
    if(fileObject.doesSubfileExist(name)) {
      return fileObject;
    } else {
      for (let x in fileObject.subfiles) {
          return recursiveSearch(fileObject.subfiles[x], name);
      }
    }
  }

  if(file.name=="portfolio") { //if current file is the root then return the root as no parent
    return file;
  } else {
    return recursiveSearch(portfolio, file.name)
  }
}

function getFilePathFromFileTreeNode(file) { //recursive function to get parent file from sub file
  let filePathVal;
  function recursiveSearch(fileObject, name, filePath) {
    if(fileObject.name==name) {
      filePathVal = [...filePath, name];
    } else {
      for (let x in fileObject.subfiles) {
          recursiveSearch(fileObject.subfiles[x], name, [...filePath, fileObject.name]);
      }
    }
  }

  if(file.name=="portfolio") { //if current file is the root then return the root as no parent
    return [file.name];
  } else {
    recursiveSearch(portfolio, file.name, []);
    return filePathVal;
  }
}
//add ls. cd/open commands
const portfolio = new FileTreeNode('portfolio',['projects','message','about']);
  const about = new FileTreeNode('about',['open insta','open fb','open github']);
  const projects = new FileTreeNode('projects',['p1','p2','p3','p4']);
    const p1 = new FileTreeNode('p1', ['open p1','doc p1']);
    const p2 = new FileTreeNode('p2', ['open p2','doc p2']);
    const p3 = new FileTreeNode('p3' ,['open p3','doc p3']);
    const p4 = new FileTreeNode('p4' ,['open p4','doc p4']);
    projects.subfiles.push(p1, p2, p3, p4);
  portfolio.subfiles.push(projects, about);

let currentFilePath = portfolio;

function w(selector) { //to remove the jQuery dependancy from the code with minimal changes, I rewrote only the functions I needed so I won't be wasting space loading the entire jQuery library
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
    let isNotMaxCharacters = ((!authorized && currentCommandTyped.length<12) || authorized);
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    let letter = String.fromCharCode(charCode).toLowerCase(); //char number to actual letter which is then forced to lowercase so even upper case cheat codes r good
    if (event.keyCode >= 48 && event.keyCode <= 57) { //if number 0-9
      if(isNotMaxCharacters && !enterUsernameMode) currentCommandTyped+= String(event.keyCode-48);
      if(!enterPasswordMode) w(".new-output").text(currentCommandTyped)
      else w(".new-output").text(toHidden(currentCommandTyped))
    } else if (event.keyCode >= 65 && event.keyCode <= 90) { //if letter a-z
      if(isNotMaxCharacters) currentCommandTyped+=letter;
      if(!enterPasswordMode) w(".new-output").text(currentCommandTyped)
      else w(".new-output").text(toHidden(currentCommandTyped))
    } else if(event.keyCode === 189) { // dash key "-"
      if(isNotMaxCharacters && !enterUsernameMode)currentCommandTyped+="-";
      if(!enterPasswordMode) w(".new-output").text(currentCommandTyped)
      else w(".new-output").text(toHidden(currentCommandTyped))
    } else if(event.keyCode === 32) { // space bar hit
      if(!enterUsernameMode && isNotMaxCharacters) currentCommandTyped+=" ";
      if(!enterPasswordMode) w(".new-output").text(currentCommandTyped)
      else w(".new-output").text(toHidden(currentCommandTyped))
    } else if(event.keyCode === 8) { // back space hit
      currentCommandTyped = currentCommandTyped.slice(0,-1); //remove last character
      if(!enterPasswordMode) w(".new-output").text(currentCommandTyped)
      else w(".new-output").text(toHidden(currentCommandTyped))
    } else if(event.keyCode === 13) { // enter key hit
      if(!authorized) {
        authorization(currentCommandTyped);
      } else {
        if(enterMessageMode) {
          sendMessage(currentCommandTyped);
          enterMessageMode = false;
          commandContext = username + "@portfolio > ";
          currentCommandTyped = "";
        } else {
          checkFilePathAndRunCommand(currentCommandTyped);
        }
      }
    } else if (event.keyCode === 38) { //up arrow key for back
      e.preventDefault();
      if(commandHistoryMarker>0){
        commandHistoryMarker-=1;
        currentCommandTyped = commandHistory[commandHistoryMarker]
        w(".new-output").text(currentCommandTyped);
      }
    } else if (event.keyCode === 40) { // down arrow key for front
      e.preventDefault();
      if(commandHistoryMarker<commandHistory.length-1){
        commandHistoryMarker+=1;
        currentCommandTyped = commandHistory[commandHistoryMarker]
        w(".new-output").text(currentCommandTyped);
      } else if(commandHistoryMarker == commandHistory.length-1 && currentCommandTyped==commandHistory[commandHistory.length-1]) {
        currentCommandTyped = "";
        w(".new-output").text(currentCommandTyped);
      }
    } //38 40 down)
};
function sendMessage(message) {
  let xmlHttp = new XMLHttpRequest();
  let formData = new FormData();
  formData.append("_subject","Comlab portfolio msg");
  formData.append("message", username + " : " + message);
        xmlHttp.onreadystatechange = function()
        {
            if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
              msgSuccess(); //console.log(xmlHttp.responseText);
            }
        }
        xmlHttp.open("post", "https://formsubmit.co/ajax/drf325@nyu.edu");
        xmlHttp.send(formData);
}

function msgSuccess() {
  printOnTerminal("Your message was sent directly to Romeno's email.")
}
function msgFail() {
  printOnTerminal("Error occured when sending message.")
}
function openUrl(url) {
  var win = window.open(url, '_blank');
  if(!win || win.closed || typeof win.closed=='undefined') { //if popups are blocked in user system change current url
    document.location.href = url;
  } else {
    win.focus();
  }
}
function printOnTerminal(txt="",noBefore = false) {
  w('.new-output').removeClass('new-output');
  if(txt!="") {
    w('#terminal').append(`<p class="${noBefore ? "promptNoBefore" : "prompt"} output" command-context="${commandContext}">${txt}</p><p class="${noBefore ? "promptNoBefore" : "prompt"} output new-output" command-context="${commandContext}"></p>`);
  } else{
    w('#terminal').append(`<p class="${noBefore ? "promptNoBefore" : "prompt"} output new-output" command-context="${commandContext}"></p>`);
  }
  w(".new-output").scrollIntoView(); //make screen scroll down as new outputs come on the terminal
}

function authorization(value) {
  if(enterUsernameMode) {
    username = value;
    enterUsernameMode = false;
    enterPasswordMode = true;
    commandContext = "Set Password > ";
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
    setCommandContext()
    currentCommandTyped = "";
    runCommand("clear");
  }
}

function setCommandContext() {
  let filePath = getFilePathFromFileTreeNode(currentFilePath).join("/")
  commandContext = `${username}@${filePath} > `;
  w('title').html(`ssh ${commandContext.slice(0, -2)}`);
}

function checkFilePathAndRunCommand(command) {
  if(currentFilePath.isValidFileTreeCommand(command)) {
    currentFilePath = currentFilePath.returnSubfile(command);
    setCommandContext();
    runCommand(command);
  } else {
    runCommand("9999999");
  }
}

function runCommand(command , saveToHistory = true) {
  let commandValid = true;
  let keepCommandContext = false;
  let c = command.replace(/\s+/g,' ').trim(); //remove any extra white space on either end of string
  let args = c.split(' ')
  if(c=="clear") {
    w('#terminal').html(`
      <div class="container d-flex h-100">
      <div class="row ">
      <div class="col-md-3 promptNoBefore justify-content-center align-self-center text-center" style="font-size: 4px; min-width: 300px;">
        <pre style="color: #1ff042; ">${ME}</pre>
      </div>
      <div class="col promptNoBefore align-middle justify-content-center align-self-center">Hello ${(username!="") ? username : "there"}, my name is Romeno. Welcome to my Communications Lab Class Portfolio! <br/><br/>${authorized ? "Type in, \"help\" and hit enter to get the available commands for each directory." : "Please ssh into the terminal by entering a username and password of your choice."} </div>
      </div>
      </div>
      </div>
    <p class="prompt output new-output" command-context="${commandContext}"></p>`);
  } else if(c=="help") {
    let goUp = (currentFilePath.name=="portfolio") ? "" : "To go up one directory, type in \"out\".";
    let extra = (arrowKeyHelpMessageCounter<1) ? "As you type in commands you can reuse your previous commands by using the up and down arrow. " + goUp : goUp;
    arrowKeyHelpMessageCounter+=1;
    printOnTerminal(`Commands available are: ${currentFilePath.listAvailableCommands()}. ${extra}`);
  } else if(c=="projects") {
    var table = new AsciiTable('Comlab Projects')
table
  .setHeading('Name','Command for more info')
  .addRow('Convinience Store Tour', "p1")
  .addRow('Period.s comic', "p2")
  .addRow('Flight: A turbulent experience', "p3")
  .addRow('GTA NYU Abu Dhabi', "p4")

printOnTerminal(table.toString(),true)
printOnTerminal();
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
    case "insta":
      openUrl("https://instagram.com/wenogk")
      printOnTerminal()
      break;
    case "github":
      openUrl("https://github.com/wenogk")
      printOnTerminal()
      break;
    case "fb":
      openUrl("https://facebook.com/iwenogk")
      printOnTerminal()
      break;
    default:
      printOnTerminal("Option doesn't exist. Options are p1, p2, p3, p4, insta, github, fb")
  }

} else if((c.startsWith("doc ") || c.startsWith("docs ")) && args.length>1) {
  switch(args[1]) {
    case "p1":
      openUrl("https://github.com/wenogk/comlab-assignment-1/blob/master/README.md")
      printOnTerminal()
      break;
    case "p2":
      openUrl("https://github.com/wenogk/comic-strip/blob/master/README.md")
      printOnTerminal()
      break;
    case "p3":
      openUrl("https://github.com/wenogk/sound-journey/blob/master/README.md")
      printOnTerminal()
      break;
    case "p4":
      openUrl("https://github.com/wenogk/gta-nyuad/blob/master/README.md")
      printOnTerminal()
      break;
    default:
      printOnTerminal("Incorrect assignment name. Options are p1, p2, p3 or p4.")
  }

} else if(c=="about") {
    printOnTerminal(`I'm Sri Lankan and currently studying Computer Science at New York University Abu Dhabi. I really like backend development and am currently learning iOS app development in Swift. I enjoy optimizing things (pfft, this whole site is under 150kb). In my free time I play pool, table tennis and watch tv shows with my friends. <br /><br />To check out my socials, type in "open github", "open insta" or "open fb"`, true);
    printOnTerminal();
  } else if(c=="p1") {
    printOnTerminal(`
      <div class="container d-flex h-100">
      <div class="row">
      <div class="col-md-3 promptNoBefore justify-content-center align-self-center text-center" style="font-size: 5px; min-width: 300px;">
        <pre style="color: #1ff042; ">${NYU_TORCH}</pre>
      </div>
      <div class="col promptNoBefore align-middle justify-content-center align-self-center">A student life tours website with a video tour of the convinience store. The websote is NYU themed and tries to emulate the official NYU webpages. It also tries to invite viewers to sign up for tours on campus. <br /><br />Type in "open p1" to see the project live or "doc p1" to see the documentation</div>
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
      <div class="col promptNoBefore align-middle justify-content-center align-self-center">A comic that deals with the taboo of menstruation. The website transitions between panels is animated allows for three different languages and has user options as the user reads the comic.<br /><br />Type in "open p2" to see the project live or "doc p2" to see the documentation</div>
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
      <div class="col promptNoBefore align-middle justify-content-center align-self-center">A turbulent sound journey in a plane. The website includes animations that are synced up to the audio to immerse the user. <br/><br/> Type in "open p3" to see the project live or "doc p3" to see the documentation</div>
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
      <div class="col promptNoBefore align-middle justify-content-center align-self-center">Grand Theft Auto themed NYUAD experience in both video and website format. <br/><br/> Type in "open p4" to see the project live or "doc p4" to see the documentation</div>
      </div>
      </div>
      `, true)
    printOnTerminal()
  } else if(c=="message") {
    commandContext = "Enter Message > ";
    printOnTerminal();
    enterMessageMode = true;
  } else if(c=="logout") {
    window.localStorage.clear();
    location.reload(); //getParentFileTreeNode
  } else if(c=="out") { //listSubfiles
    currentFilePath = getParentFileTreeNode(currentFilePath);
    setCommandContext();
    printOnTerminal();
  } else if(c=="list") {
    printOnTerminal(currentFilePath.listSubfiles());
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

}

if(window.localStorage.getItem('user')!== null) { //if user already logged in, set the variables accordingly
  enterUsernameMode = false;
  enterPasswordMode = false;
  authorized = true;
  let data = JSON.parse(window.localStorage.getItem('user'));
  username = data.username;
  password = data.password;
  setCommandContext();
  currentCommandTyped = "";
}

runCommand("clear", false);
console.log(INCEPTION)
