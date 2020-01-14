## JerboaTTS

A simple Text Terminal Simulator for Javascript.

After watching some Python games like [Terminal RPG](https://stay-alive.itch.io/terminal-rpg) I was intrigued on how hard it would be to simulate that environment in Javascript.  
I quickly made a prototype (*Terminal.html*), a simple "pre" tag that is manipulated through Javascript.

Since I also wanted to color the letters and handle wider characters I moved to using a "canvas" tag (*JSTTS.html*), in which I developed most of the visual functionalities. It's a Grid of letters to simulate a mono-spaced font rendered into a View, which represents the 'canvas'.  
Since the HTML was getting crowded I decided to split it, taking the chance to also change its name to avoid confusion with other libraries.  

I chose the name of an animal. Namely, the "hoping desert rodent" [Jerboa](https://en.wikipedia.org/wiki/Jerboa), instead of the 'JS'.  
After splitting the project into a jerboa.js and an index.html  (*JerboaTTS*) I started organizing the code.  
Not only did I clean it up but I also bundled parts of the code into objects (no more loose multi-dimensional arrays).  
And so, after developing it for a while I arrived at a library that is flexible enough to allow users to play with and understand.

After the latest changes it's apparent that this project has gone beyond Text Terminals since it supports strokes (outlines) and Unicode characters which can have several colors. I had not realized that Unicode had evolved this far!

I made a small (single screen) game to show what one could do with JerboaTTS.

Note:
- You can find [an index of Unicode characters here](https://unicode-table.com/en/) but you have to use HTML-codes in the Prototype or Unicode numbers on JSTTS/JerboaTTS,
- If the Grid has the same size as the View, by using Grid = Jerboa.grid(View) for example, it will fill the entire canvas,
- Enabling the frames allows you to see how wide some of those Unicode characters are. Yikes!
- I added a meta tag that avoids zooming to the main example (index.html). While it won't affect the canvas it still affects text and we don't want scrollbars.
- You can't color symbols if they're colored themselves, but you can still color their backgrounds
- There is a basic 'template.html' file with the minimum code

In the following examples, you can move a "Player" character (depicted by the **☻** character) with the cursor keys.  
They also have the following controls:
- A/Z : Increase/Decrease the Views' number of COLS [JerboaTTS]
- S/X : Increase/Decrease the Views' number of ROWS [JerboaTTS]
- D/C : Increase/Decrease the Views' cell height (size of the font) [JSTTS/JerboaTTS]
- Spacebar : Toggle the frames (outline around each cell) [JSTTS/JerboaTTS/Game]
- Return : Toggle the details (such as FPS and various sizes) [JerboaTTS]

## Examples (which run in your Browser)

## [Game](https://vimino.gitlab.io/JerboaTTS/game.html)
## [JerboaTTS](https://vimino.gitlab.io/JerboaTTS)
## [JSTTS](https://vimino.gitlab.io/JerboaTTS/jstts.html)
## [Prototype](https://vimino.gitlab.io/JerboaTTS/prototype.html)

### Version

- JerboaTTS : 9
- JSTTS : 8
- Prototype : 6

### License

Copyright &copy; 2018, Vítor T. Martins

Licensed under the [MIT License ](https://opensource.org/licenses/MIT).
