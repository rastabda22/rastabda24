## JerboaTTS

A simple Text Terminal Simulator for Javascript.

After watching some Python games made in terminals (command lines) I was intrigued. How hard would it be to simulate this graphical environment if I used Javascript?  
I quickly made a prototype. However it doesn't support many symbols as they are either not in the monospace font or had wider widths, thus shifting the Border.  
This functional prototype has a simple "pre" tag and manipulates through Javascript.

Since to color the letters it needed a tag enclosing each letter I thought, "why not use an HTML5 canvas instead?"  
Of course, that decision meant I wouldn't touch the prototype any further.

Some time later I created a new iteration (named 'JSTTS.html') but I needed to split its functionality from the HTML as it had a lot of definitions in the head section.  
To avoid confusion with existing bearers of the TTS name I also decided to add the name of an animal. In this case, the "hoping desert rodent" [Jerboa](https://en.wikipedia.org/wiki/Jerboa).  
Quickly splitting the project into an index.html and a jerboa.js (the library that handles the behind-the-scenes work) I kept iterating and made something nifty.

You can try the example and the prototype where you can move the Player character (depicted by a **☻** character) with the cursor keys.  
The example also has the following controls:
- A/Z : Increase/Decrease the Views number of COLS
- S/X : Increase/Decrease the Views' number of ROWS
- D/C : Increase/Decrease the Views' cell height (size of the font)
- Spacebar : Toggle the grid around each cell
- Return : Toggle the details (such as FPS and various sizes)

PS: Enabling the grid allows you to see how much wider some of the characters are. Yikes!

## Examples

## [Try the main one, here](https://vimino.gitlab.io/JerboaTTS)
## [Or the prototype, here](https://vimino.gitlab.io/JerboaTTS/prototype.html)

### Version

- JerboaTTS : 4.0
- Prototype : 6

### License

Copyright &copy; 2018, Vítor T. Martins

Licensed under the [MIT License ](https://opensource.org/licenses/MIT).
