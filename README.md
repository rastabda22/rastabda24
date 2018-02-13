## JerboaTTS

A simple Text Terminal Simulator for Javascript.

After watching some Python games made in terminals (command lines) I was intrigued. How hard would it be to simulate this graphical environment if I used Javascript?  
I quickly made a prototype. However it doesn't support many symbols as they are either not in the monospace font or had wider widths, thus shifting the Border.  
This functional prototype has a simple "pre" tag and manipulates through Javascript.

Since to color the letters it needed a tag enclosing each letter I thought, "why not use an HTML5 canvas instead?"  
Of course, that decision meant I wouldn't touch the prototype any further.

Some time later I created the new 'JSTTS.html'. This includes most of the functionalities that JerboaTTS has.
However I wanted to split its functionality from the HTML and avoid confusion with existing bearers of the TTS name.
That's when I decided to add the name of an animal. In this case, the "hoping desert rodent" [Jerboa](https://en.wikipedia.org/wiki/Jerboa).  
After splitting the project into an index.html and a jerboa.js (the library that handles the behind-the-scenes work) I kept iterating and made this nifty library.  
Not only did I clean it up, I also bundled the code into objects (ex: The Grid stopped being a multi-dimensional array that was manipulated directly).  
And so, after nearly 24 hours (in total) of development, the library does more than I expected and it's flexible enough to allow users to change sizes in real-time.

In these examples, you can move the Player character (depicted by a **☻** character) with the cursor keys.  
The main example also has the following controls:
- A/Z : Increase/Decrease the Views number of COLS
- S/X : Increase/Decrease the Views' number of ROWS
- D/C : Increase/Decrease the Views' cell height (size of the font)
- Spacebar : Toggle the grid around each cell
- Return : Toggle the details (such as FPS and various sizes)

PS: Enabling the grid allows you to see how much wider some of the characters are. Yikes!

## Examples

## [Try the latest one, here](https://vimino.gitlab.io/JerboaTTS)
## [Or the prototype, here](https://vimino.gitlab.io/JerboaTTS/prototype.html)

### Version

- JerboaTTS : 4.0
- JSTTS : 8 (it's mostly the same as JerboaTTS, without the Detail toggle and COL/ROW controls)
- Prototype : 6

### License

Copyright &copy; 2018, Vítor T. Martins

Licensed under the [MIT License ](https://opensource.org/licenses/MIT).
