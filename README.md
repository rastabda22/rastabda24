## JerboaTTS

A simple Text Terminal Simulator for Javascript.

After watching some Python games made in terminals (command lines) I was intrigued on how hard it would be to simulate them in Javascript.  
I quickly made a prototype, a simple "pre" tag that is manipulated through Javascript, but I also wanted to color the letters and handle wider characters.

That's when I moved to using a "canvas" tag in  'JSTTS.html', in which I developed most of the visual functionalities that the current JerboaTTS has.  
Since the HTML was getting crowded I decided to split it, taking the chance to also change its name to avoid confusion with other libraries.  
I chose the name of an animal. Namely, the "hoping desert rodent" [Jerboa](https://en.wikipedia.org/wiki/Jerboa).  

After splitting the project into a jerboa.js and an index.html I started organizing the code.  
Not only did I clean it up but I also bundled parts of the code into objects (no more loose multi-dimensional arrays).  
And so, after developing it for a while I arrived at a library that is flexible enough to allow users to play with and understand.

In these examples, you can move a "Player" character (depicted by the **☻** character) with the cursor keys.  
The main example also has the following controls:
- A/Z : Increase/Decrease the Views number of COLS
- S/X : Increase/Decrease the Views' number of ROWS
- D/C : Increase/Decrease the Views' cell height (size of the font)
- Spacebar : Toggle the grid around each cell
- Return : Toggle the details (such as FPS and various sizes)

PS: Enabling the borders allows you to see how wide some of those characters are. Yikes!

## Examples

## [Try the latest one, here](https://vimino.gitlab.io/JerboaTTS)
## [Or the prototype, here](https://vimino.gitlab.io/JerboaTTS/prototype.html)

### Version

- JerboaTTS : 5
- JSTTS : 8
- Prototype : 6

### License

Copyright &copy; 2018, Vítor T. Martins

Licensed under the [MIT License ](https://opensource.org/licenses/MIT).