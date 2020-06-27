# Communications Lab Portfolio

A terminal themed website that showcases my class projects. To give the terminal feel, the source code pro font, a black background ,no (invisible) cursors were used.

Some of the features of the terminal:
  * File directory simulation
  * Fake user authentication and persistance using cookies
  * Actually send me an email using the message command directly from the terminal
  * Commands to open the live and documentation links for each of my projects
  * Up/down arrow key for command history
  * Images in the terminal are just ASCII text and not images
  * Many commands inspired by actual terminal
    * out - inspired by "cd .. " command to go up one directory
    * list - inspired by "ls" command to list files in directory
 
The website is about 150kb and multiple optimizations were made to save space:
  * Jquery was removed and the functions required were rewritten in vanilla js
  * Bootstrap was removed and a custom build of it was made with just its grid and md classes
  * The use of ascii text for images saved up alot of space as all the media is held in media.js and the file is under 30kb
  * The next step is to minify all the js and css
  
