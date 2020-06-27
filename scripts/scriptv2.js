let currentCommandTyped = ""; //the current command typed by the user as a combination of their keystrokes
let commandContext = "Enter Username > "; // this variable is used for the part before every terminal prompt including the username@filepath >
let commandHistory = []; //array that holds the user's command history
let commandHistoryMarker = 0; //an index marker for the commandHistory based on the user using their up/down arrow key
let username = ""; //username of current user
let password = ""; //password of current user
let authorized = false; //bool to prevent command execution without authorization
let enterUsernameMode = true; //bool to start username entering process
let enterPasswordMode = false; //bool to start pass entering process
let enterMessageMode = false; //bool to start message entering process
let arrowKeyHelpMessageCounter = 0; //counter to display the arrow help message only once so it's not annoying


class FileTreeNode { //Class for each individual, "File" object
  constructor(value, commands) { //constructor taking the file name and accepted commands
    this.name = value; //setting name of file
    this.subfiles = []; //these will be initialized later
    this.availableCommands = [...commands,"out","list","clear","logout","help",""]; //spread operator to add the default commands as well that are there for all files.
  }
  listAvailableCommands() { //function that lists the possible commands for the specific directory
    let pretty = [] //in the following for loop and if statements we clean the list so that some redundant commands such as 'help' or 'out' when ur in a top level directory can be ignored in the display.
    for (let x in this.availableCommands) {
      if(this.availableCommands[x] != "" && this.availableCommands[x] != "help") {
        if(!(this.name == "portfolio" && this.availableCommands[x] == "out")) {
          if(!((this.subfiles.length==0)&&(this.availableCommands[x] == "list"))) {
            pretty.push(this.availableCommands[x])
          }
        }
      }
    }
    return pretty.join(', '); //returns a string of the array items separated by a comma
  }

  listSubfiles() { //simple function that lists out the subfiles (sub directories) of a specific file object
    let f = [];
    for (let x in this.subfiles) {
      f.push(this.subfiles[x].name)
    }
    return f.join(', '); //returns a string of the array items separated by a comma
  }

  isValidFileTreeCommand(command) {  //checks if a command string is present in the available commands for a specific file directory and returns a bool
    return this.availableCommands.includes(command);
  }

  returnSubfile(fileName) { //return a sub file object based on a file name
    for (let x in this.subfiles) {
      if(this.subfiles[x].name === fileName) {
        return this.subfiles[x];
      }
    }
    return this;
  }

  doesSubfileExist(fileName) { //return bool based on whether file with filename exists in subfile array
    for (let x in this.subfiles) {
      if(this.subfiles[x].name === fileName) {
        return true;
      }
    }
    return false;
  }

}

function getParentFileTreeNode(file) { //recursive function to get parent file from sub file
  function recursiveSearch(fileObject, name) { //closure function for recursion
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
    return recursiveSearch(portfolio, file.name) //call recursive function
  }
}

function getFilePathFromFileTreeNode(file) { //recursive function to get full file path from file object
  let filePathVal;
  function recursiveSearch(fileObject, name, filePath) { //recursive function
    if(fileObject.name==name) { //if the desired file object has been reached in the tree, set the filePathVal to the path, which is the exact path we require
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
    recursiveSearch(portfolio, file.name, []); //call recursive function
    return filePathVal;
  }
}
//The following is the initialization of the file tree nodes based on the hierachy and available commands for each directory
const portfolio = new FileTreeNode('portfolio',['projects','message','about']);
  const about = new FileTreeNode('about',['open insta','open fb','open github']);
  const projects = new FileTreeNode('projects',['p1','p2','p3','p4']);
    const p1 = new FileTreeNode('p1', ['open p1','doc p1']);
    const p2 = new FileTreeNode('p2', ['open p2','doc p2']);
    const p3 = new FileTreeNode('p3' ,['open p3','doc p3']);
    const p4 = new FileTreeNode('p4' ,['open p4','doc p4']);
    projects.subfiles.push(p1, p2, p3, p4);
  portfolio.subfiles.push(projects, about);

let currentFilePath = portfolio; //the initial file path is obviously the portfolio.


//the w function here is similar to jquery's $, I just wanted a few easy functions for reuse.
function w(selector) { //to remove the jQuery dependancy from the code with minimal changes, I rewrote only the functions I needed so I won't be wasting space loading the entire jQuery library
return document.querySelector(selector);
}

HTMLElement.prototype.text = function(text) { //similar to jquery's $(element).text() function
  this.innerHTML = text;
};

HTMLElement.prototype.append = function(text) { //similar to jquery's $(element).append() function
  this.innerHTML = this.innerHTML + text;
};

HTMLElement.prototype.html = function(html) { //similar to jquery's $(element).html() function
  this.innerHTML = html;
};

HTMLElement.prototype.removeClass = function(remove) { //similar to jquery's $(element).removeClass() function
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
function toHidden(password) { //simple function that returns a string of asterisks with the same length as the input string, this is used for the password entry.
  return "*".repeat(password.length);
}
document.onkeydown = function(e) { //key press event listener for terminal typing / enter / backspace / arrow keys etc.
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
      if(!authorized) { //if not authorized call the authorization function and don't execute the command
        authorization(currentCommandTyped);
      } else {
        if(enterMessageMode) { //if in message mode and enter is clicked it means the user finished typing their message and hit enter, so send the message to the API
          sendMessage(currentCommandTyped); //function that calls the email API and sends the message
          enterMessageMode = false;
          setCommandContext(); //reset the command context text from "enter a message > " back to the correct file directory and username
          currentCommandTyped = "";
        } else {
          checkFilePathAndRunCommand(currentCommandTyped); //call function that checks the file path and if the command typed is available using our FileTreeNode object and then running it.
        }
      }
    } else if (event.keyCode === 38) { //up arrow key for previous command typed
      e.preventDefault();
      if(commandHistoryMarker>0){
        commandHistoryMarker-=1; //move the command history index marker
        currentCommandTyped = commandHistory[commandHistoryMarker]
        w(".new-output").text(currentCommandTyped); //set the prompt to the correct command
      }
    } else if (event.keyCode === 40) { // down arrow key for next command typed when user has hit the arrow key back
      e.preventDefault();
      if(commandHistoryMarker<commandHistory.length-1){
        commandHistoryMarker+=1; //move the command history index marker
        currentCommandTyped = commandHistory[commandHistoryMarker]
        w(".new-output").text(currentCommandTyped);
      } else if(commandHistoryMarker == commandHistory.length-1 && currentCommandTyped==commandHistory[commandHistory.length-1]) {
        currentCommandTyped = "";
        w(".new-output").text(currentCommandTyped); //set the prompt to the correct command
      }
    } //38 40 down)
};
function sendMessage(message) { //simple function that posts some form data (the user's name and message) as a formdata object to a free API that will email me the response directly.
  let xmlHttp = new XMLHttpRequest();
  let formData = new FormData();
  formData.append("_subject","Comlab portfolio msg");
  formData.append("message", username + " : " + message);
        xmlHttp.onreadystatechange = function()
        {
            if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
              msgSuccess(); //callback to print success message back to user
            }
        }
        xmlHttp.open("post", "https://formsubmit.co/ajax/drf325@nyu.edu");
        xmlHttp.send(formData);
}

function msgSuccess() { //message sent successfully
  printOnTerminal("Your message was sent directly to Romeno's email.")
}

function openUrl(url) { //function that attempts to open a URL in a new tab, if it fails (possibly becuase of popup blockers) it will open the url in the same tab, if it successful tho, it will set the focus to that new tab.
  var win = window.open(url, '_blank');
  if(!win || win.closed || typeof win.closed=='undefined') { //if popups are blocked in user system change current url
    document.location.href = url;
  } else {
    win.focus();
  }
}
function printOnTerminal(txt="",noBefore = false) { //function to print on the terminal UI. the noBefore arg basically means no command context (no user@portfolio > stuff)
  w('.new-output').removeClass('new-output'); //cus this element that has the new-output class is now old and we are gonna make a new one for the current print call
  if(txt!="") {
    w('#terminal').append(`<p class="${noBefore ? "promptNoBefore" : "prompt"} output" command-context="${commandContext}">${txt}</p><p class="${noBefore ? "promptNoBefore" : "prompt"} output new-output" command-context="${commandContext}"></p>`); //template literal that puts in the relevant classes and html content based on args
  } else{
    w('#terminal').append(`<p class="${noBefore ? "promptNoBefore" : "prompt"} output new-output" command-context="${commandContext}"></p>`);
  }
  w(".new-output").scrollIntoView(); //make screen scroll down as new outputs come on the terminal
}

function authorization(value) { //function  that handles the authorization of the user including setting username and password values as well as persistance of this information in the local cookie storage of the browser
  if(enterUsernameMode) {
    username = value; //setting username after user has typed in and hit enter
    enterUsernameMode = false; //username has been entered so now its time to enter the password
    enterPasswordMode = true;
    commandContext = "Set Password > ";
    currentCommandTyped = ""; //reset the command typed
    printOnTerminal();
  } else if(enterPasswordMode) {
    password = value; //setting password after user has typed in and hit enter
    const user = { //user object to store in local storage
    username: username,
    password: password,
    }
    window.localStorage.setItem('user', JSON.stringify(user)); //actually storing user data in local storage
    enterPasswordMode = false; //password has been entered so authorization is complete
    authorized = true; //set authorized to true so this function won't be called again
    setCommandContext() //set the command context text in terminal to have username@directory >
    currentCommandTyped = ""; //reset the command typed
    runCommand("clear"); //clears the terminal
  }
}

function setCommandContext() { //setting the command context, the stuff before the > in the terminal
  let filePath = getFilePathFromFileTreeNode(currentFilePath).join("/") //getting the full file path from the current directory FileTreeNode object
  commandContext = `${username}@${filePath} > `; //template literal to for the command context string
  w('title').html(`ssh ${commandContext.slice(0, -2)}`);
}

function checkFilePathAndRunCommand(command) {
  if(currentFilePath.isValidFileTreeCommand(command)) { //check with FileTreeNode's availableCommands property to see if the current command is acceptable for the current directory
    currentFilePath = currentFilePath.returnSubfile(command);
    setCommandContext();
    runCommand(command); //finally actually call the run command function to run the command
  } else {
    runCommand("9999999"); //the 999999 is just a trick, this means there won't be any command matched so the default error message will be displayed in the terminal which is exactly what we want
  }
}

function runCommand(command , saveToHistory = true) { //run command function, second argument is for whether I want to save it in the command history so the user can access it using the arrow keys
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
      <div class="col promptNoBefore align-middle justify-content-center align-self-center">A comic that deals with the taboo of menstruation. The website has dynamic animated transitions between panels, allows for three different languages and has user options as the user reads the comic.<br /><br />Type in "open p2" to see the project live or "doc p2" to see the documentation</div>
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
    if(currentFilePath.name!="portfolio") {
      setCommandContext();
      runCommand(currentFilePath.name);
    } else {
      setCommandContext();
      printOnTerminal();
    }
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
