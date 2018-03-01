// Javascript Text Terminal Simulator
// Version 7
//
// The MIT License (MIT)
//
// Copyright (c) 2018 Vítor T. Martins
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Point, same as {x:_,y:_}
var Point = function Point (x = 0, y = 0) {
  return {
    'x': x,
    'y': y
  }
}

// Rect(angle), same as (x:_,y:_,w:_,h:_)
var Rect = function Rect (x = 0, y = 0, w = 0, h = 0) {
  return {
    'x': x,
    'y': y,
    'w': w,
    'h': h
  }
}

// Cell CSS Parameters, same as {value:_,fill:_,background:_,font:_}
// Note that the fonts should only have the name (ex: 'monospace')
var Cell = function Cell (value = undefined, fill = undefined, background = undefined, font = undefined) {
  return {
    'value': value,
    'fill': fill,
    'background': background,
    'font': font,
  }
}


// Convert a hexadecimal value to a character (required to support characters above \uFFFF)
// Adapted from https://stackoverflow.com/questions/5446492/unicode-characters-from-charcode-in-javascript-for-charcodes-0xffff#5446605
var Unicode = function Unicode (codePoint = 0x0000) {
    //console.log('Unicode', codePoint)

    if (codePoint > 0xFFFF) {
        codePoint -= 0x10000;
        return String.fromCharCode(0xD800 + (codePoint >> 10), 0xDC00 + (codePoint & 0x3FF));
    } else {
        return String.fromCharCode(codePoint);
    }
}

// Main object
var Jerboa = {}

// JerboaGrid, has a matrix of COLSxROWS cells
Jerboa.grid = function JerboaGrid (cols, rows) {
  // Private properties of the Grid
  var _rows = undefined
  var _cols = undefined
  var _cells = undefined

  var _defaultCell = {} // Default Cell style
  var _border = {} // Cell Border style

  // Resize the Grid, updating its cells, cols and rows
  this.resize = function resize (cols = undefined, rows = undefined) {
    // If the first argument is a View or a Grid, copy its size
    if (cols !== undefined && (cols instanceof Jerboa.view || cols instanceof Jerboa.grid)) {
      _cols = cols.cols()
      _rows = cols.rows()
      _defaultCell = cols.default()
      _border = cols.border()
    } else {
      _cols = cols === undefined ? _cols : cols
      _rows = rows === undefined ? _rows : rows
    }

    // Create a multi-dimensional Array of empty objects
    _cells = new Array(_rows)
    for (var row = 0; row < _rows; ++row) {
      _cells[row] = new Array(_cols)
      for (var col = 0; col < _cols; ++col) {
        _cells[row][col] = {}
      }
    }
  }

  // Get the private number of columns
  this.cols = function cols () {
    return _cols
  }

  // Get the private number of rows
  this.rows = function rows () {
    return _rows
  }

  // Set the value of a Cell
  this.set = function set (col, row, props) {
    if (row < 0 || row >= _rows) { return }
    if (col < 0 || col >= _cols) { return }
    _cells[row][col] = props
  }

  // Get the value of a Cell
  this.get = function get (col, row) {
    if (row < 0 || row > _rows) { return }
    if (_rows < 1 || col < 0 || col > _cols) { return }
    return _cells[row][col]
  }

  // Set/Get the default Cell style
  this.default = function defaultCell (props = {}) {
    for (var prop in props) {
      _defaultCell[prop] = props[prop]
    }

    // Create a copy and return it
    var defaultCell = {}
    for (var prop in _defaultCell) {
      defaultCell[prop] = _defaultCell[prop]
    }
    return defaultCell
  }

  // Set/Get the style of the Border (Stroke Color and Line Width)
  this.border = function border (color = undefined, width = 1, visible = false) {
    _border.color = color === undefined ? _border.color : color
    _border.width = width
    _border.visible = visible

    // Create a copy and return it
    var border = {}
    for (var prop in _border) {
      border[prop] = _border[prop]
    }
    return border
  }

  // Initialize the Grid
  this.resize(cols, rows)
}

// JerboaView, represents the canvas own COLSxROWS
Jerboa.view = function JerboaView (cols, rows, cellSize, context = undefined) {
  // Private properties of the View
  var _rows = undefined
  var _cols = undefined
  var _cellSize = { 'height': 16, 'ratio': 0.75 }

  var _defaultCell = {} // Default Cell style
  var _border = { 'color': 'black', 'width': 1, 'visible': false } // Cell Border style

  // Canvas variables, these are updated on any View resize
  this.width = undefined
  this.height = undefined
  this.ratio = undefined
  this.context = undefined // Canvas Context (note: this has no width/height)
  this.changed = false

  // Get the number of columns
  this.cols = function cols () {
    return _cols
  }

  // Get the number of rows
  this.rows = function rows () {
    return _rows
  }

  // Get the cell sizes
  this.cell = function cell () { // height, width = undefined) {
    return _cellSize
  }

  // Set/Get the default Cell style
  this.default = function defaultCell (props = {}) {
    for (var prop in props) {
      _defaultCell[prop] = props[prop]
    }

    // Create a copy and return it
    var defaultCell = {}
    for (var prop in _defaultCell) {
      defaultCell[prop] = _defaultCell[prop]
    }
    return defaultCell
  }

  // Set/Get the style of the Border (Stroke Color and Line Width)
  this.border = function border (color = undefined, width = undefined, visible = false) {
    _border.color = color === undefined ? _border.color : color
    _border.width = width === undefined ? _border.width : width
    _border.visible = visible

    // Create a copy and return it
    var border = {}
    for (var prop in _border) {
      border[prop] = _border[prop]
    }
    return border
  }

  // Resize the View
  this.resize = function resize (cols = undefined, rows = undefined, cellSize = {}) {
    // If the first argument is a View or a Grid, copy its size
    if (cols !== undefined && (cols instanceof Jerboa.view || cols instanceof Jerboa.grid)) {
      _cols = cols.cols()
      _rows = cols.rows()
      _defaultCell = cols.default()
      _border = cols.border()
    } else {
      _cols = cols === undefined ? _cols : cols
      _rows = rows === undefined ? _rows : rows
    }

    // If there is a cell size
    if (cellSize !== undefined) {
      if (cellSize['height']) {
        _cellSize.height = cellSize.height
      }
      if (cellSize['ratio']) { _cellSize.ratio = cellSize.ratio }
      if (cellSize['width']) {
        _cellSize.width = cellSize.width
      } else {
        _cellSize.width = Math.floor(_cellSize.height * _cellSize.ratio)
      }
    }

    // Update the Canvas values
    this.width = _cols * _cellSize.width
    this.height = _rows * _cellSize.height
    this.ratio = this.width / this.height

    // Request the recalculation as the Canvas size needs to change
    this.changed = true
  }

  // Initialize the View
  this.resize(cols, rows, cellSize)
  if (context !== undefined) { this.context = context }
}

// Fill an Area of a JerboaGrid with a Character
Jerboa.fill = function (grid, rect = Rect(), props = Cell()) {
  if (grid === undefined || !(grid instanceof Jerboa.grid)) {
    console.error('Jerboa.fill', 'Grid ' + (grid === undefined ? 'is not defined' : 'is not a JesboaGrid'))
    return false
  }

  // Get the Y component of the area and make sure it's within the Grid
  var y = rect.y === undefined ? 0 : rect.y
  if (y < 0) {
    console.warn('Jerboa.fill(' + x + ', ' + y + ', ' + w + ', ' + h + ')', 'Area outside grid (' + grid.cols() + ', ' + grid.rows() + ')')
    y = 0
  } else if (y >= grid.rows()) {
    console.warn('Jerboa.fill(' + x + ', ' + y + ', ' + w + ', ' + h + ')', 'Area outside grid (' + grid.cols() + ', ' + grid.rows() + ')')
    y = grid.rows() - 1
  }

  // Get the H component of the area and make sure it's within the Grid
  var h = rect.h === undefined || rect.h === 0 ? grid.rows() - 1 : rect.h
  if (h >= grid.rows()) {
    console.warn('Jerboa.fill(' + x + ', ' + y + ', ' + w + ', ' + h + ')', 'Area outside grid (' + grid.cols() + ', ' + grid.rows() + ')')
    h = grid.rows() - 1
  }

  // Get the X component of the area and make sure it's within the Grid
  var x = rect.x === undefined ? 0 : rect.x
  if (x < 0) {
    console.warn('Jerboa.fill(' + x + ', ' + y + ', ' + w + ', ' + h + ')', 'Area outside grid (' + grid.cols() + ', ' + grid.rows() + ')')
    x = 0
  } else if (x >= grid.cols()) {
    console.warn('Jerboa.fill(' + x + ', ' + y + ', ' + w + ', ' + h + ')', 'Area outside grid (' + grid.cols() + ', ' + grid.rows() + ')')
    x = grid.cols() - 1
  }

  // Get the W component of the area and make sure it's within the Grid
  var w = rect.w === undefined || rect.w === 0 ? grid.cols() - 1 : rect.w
  if (w >= grid.cols()) {
    console.warn('Jerboa.fill(' + x + ', ' + y + ', ' + w + ', ' + h + ')', 'Area outside grid (' + grid.cols() + ', ' + grid.rows() + ')')
    w = grid.cols() - 1
  }

  // Set the property of every Cell within the area
  for (var row = y; row <= h; ++row) {
    for (var col = x; col <= w; ++col) {
      grid.set(col, row, props)
    }
  }

  return true
}

// Set a Cells' value
Jerboa.put = function (grid, position = Point(), props = Cell()) {
  if (grid === undefined || !(grid instanceof Jerboa.grid)) {
    console.error('Jerboa.put', 'Grid ' + (grid === undefined ? 'is not defined' : 'is not a JesboaGrid'))
    return false
  }

  // Get the Y component of the position and make sure it's within the Grid
  var y = position.y
  if (y < 0) {
    console.warn('Jerboa.put(' + x + ', ' + y + ')', 'Position outside grid (' + grid.cols() + ', ' + grid.rows() + ')')
    y = 0
  } else if (y >= grid.rows()) {
    console.warn('Jerboa.put(' + x + ', ' + y + ')', 'Position outside grid (' + grid.cols() + ', ' + grid.rows() + ')')
    y = grid.rows() - 1
  }

  // Get the X component of the position and make sure it's within the Grid
  var x = position.x
  if (x < 0) {
    console.warn('Jerboa.put(' + x + ', ' + y + ')', 'Position outside grid (' + grid.cols() + ', ' + grid.rows() + ')')
    x = 0
  } else if (x >= grid.cols()) {
    console.warn('Jerboa.put(' + x + ', ' + y + ')', 'Position outside grid (' + grid.cols() + ', ' + grid.rows() + ')')
    x = grid.cols() - 1
  }

  // Set the Cells popeties
  grid.set(x, y, props)

  return true
}

// Write a string of Text to a sequence of Cells
Jerboa.write = function (grid, position = Point(), text = undefined, fill = undefined, background = undefined) {
  if (grid === undefined || !(grid instanceof Jerboa.grid)) {
    console.error('Jerboa.write', 'Grid ' + (grid === undefined ? 'is not defined' : 'is not a JesboaGrid'))
    return false
  }

  if (text === undefined) {
    console.warn('Jerboa.write', 'Text is not defined')
    _text = ''
  } else {
    _text = (typeof(text) === 'string' ? text : text.toString())
  }

  // Draw each letter on sequential Cells
  for (let x = 0; x < _text.length; ++x) {
    if (position.x + x > grid.cols()) { break }
    grid.set(position.x + x, position .y, Cell(_text.substring(x, x + 1), fill, background))
  }
}

// Draw a line using a specified Cell. Only supports horizontal or vertical lines
Jerboa.line = function (grid, start = Point(), end = Point(), props = Cell()) {
  if (grid === undefined || !(grid instanceof Jerboa.grid)) {
    console.error('Jerboa.line', 'Grid ' + (grid === undefined ? 'is not defined' : 'is not a JesboaGrid'))
    return false
  }

  var cell = undefined

  // Horizontal line
  if (start.y === end.y) {
    for (let col = start.x; col < end.x; ++col) {
      grid.set(col, start.y, props)
    }
    return true
  }

  // Vertical line
  if (start.x === end.x) {
    for (let row = start.y; row < end.y; ++row) {
      grid.set(start.x, row, props)
    }
    return true
  }

  return false
}

// Add a border to the Grid. This border is created with the ASCII block characters
Jerboa.border = function (grid, rect = Rect(), fill = undefined, background = undefined) {
  if (grid === undefined || !(grid instanceof Jerboa.grid)) {
    console.error('Jerboa.border', 'Grid ' + (grid === undefined ? 'is not defined' : 'is not a JesboaGrid'))
    return
  }

  // Get the Y component of the area and make sure it's within the Grid
  var y = rect.y === undefined ? 0 : rect.y
  if (y < 0) {
    console.warn('Jerboa.fill(' + x + ', ' + y + ', ' + w + ', ' + h + ')', 'Area outside grid (' + grid.cols() + ', ' + grid.rows() + ')')
    y = 0
  } else if (y >= grid.rows()) {
    console.warn('Jerboa.border(' + x + ', ' + y + ', ' + w + ', ' + h + ')', 'Area outside grid (' + grid.cols() + ', ' + grid.rows() + ')')
    y = grid.rows() - 1
  }

  // Get the H component of the area and make sure it's within the Grid
  var h = rect.h === undefined || rect.h === 0 ? grid.rows() - 1 : rect.h
  if (h >= grid.rows()) {
    console.warn('Jerboa.border(' + x + ', ' + y + ', ' + w + ', ' + h + ')', 'Area outside grid (' + grid.cols() + ', ' + grid.rows() + ')')
    h = grid.rows() - 1
  }

  // Get the X component of the area and make sure it's within the Grid
  var x = rect.x === undefined ? 0 : rect.x
  if (x < 0) {
    console.warn('Jerboa.border(' + x + ', ' + y + ', ' + w + ', ' + h + ')', 'Area outside grid (' + grid.cols() + ', ' + grid.rows() + ')')
    x = 0
  } else if (x >= grid.cols()) {
    console.warn('Jerboa.border(' + x + ', ' + y + ', ' + w + ', ' + h + ')', 'Area outside grid (' + grid.cols() + ', ' + grid.rows() + ')')
    x = grid.cols() - 1
  }

  // Get the W component of the area and make sure it's within the Grid
  var w = rect.w === undefined || rect.w === 0 ? grid.cols() - 1 : rect.w
  if (w >= grid.cols()) {
    console.warn('Jerboa.border(' + x + ', ' + y + ', ' + w + ', ' + h + ')', 'Area outside grid (' + grid.cols() + ', ' + grid.rows() + ')')
    w = grid.cols() - 1
  }

  // Add a Border by using ASCII block characters
  Jerboa.put(grid, Point(x, y), Cell('\u259B', fill, background))
  Jerboa.line(grid, Point(x + 1, y), Point(w, y), Cell('\u2580', fill, background))
  Jerboa.put(grid, Point(w, y), Cell('\u259C', fill, background))

  Jerboa.line(grid, Point(x, y + 1), Point(x, h), Cell('\u258C', fill, background))
  Jerboa.line(grid, Point(w, y + 1), Point(w, h), Cell('\u2590', fill, background))

  Jerboa.put(grid, Point(x, h), Cell('\u2599', fill, background))
  Jerboa.line(grid, Point(x + 1, h), Point(w, h), Cell('\u2584', fill, background))
  Jerboa.put(grid, Point(w, h), Cell('\u259F', fill, background))
}

// Render the contents of a grid to a View
Jerboa.render = function (grid, view, center = Point(0, 0), ShowBorders = false) {
  if (grid === undefined || !(grid instanceof Jerboa.grid)) {
    console.error('Jerboa.render', 'Grid ' + (grid === undefined ? 'is not defined' : 'is not a JesboaGrid'))
    return
  }

  if (view === undefined || !(view instanceof Jerboa.view)) {
    console.error('Jerboa.render', 'View ' + (view === undefined ? 'is not defined' : 'is not a JesboaView'))
    return
  }

  // Get tbe values common to all cells to avoid repeatedly looking for them
  var gricol = grid.cols()
  var grirow = grid.rows()
  var viecol = view.cols()
  var vierow = view.rows()
  var cesiz = view.cell()
  var horizontalOffset = cesiz.width / 2
  var verticalOffset = cesiz.height / 2

  var gridef = grid.default()
  var gribor = grid.border()

  var viedef = view.default()
  var viebor = view.border()

  // Calculate the offset based on a Center point
  var offset = Point(0, 0)
  offset.x = center.x - Math.floor(viecol / 2)
  if (offset.x < 0) { offset.x = 0 }
  if (offset.x + viecol > gricol) { offset.x = gricol - viecol }
  offset.y = center.y - Math.floor(vierow / 2)
  if (offset.y < 0) { offset.y = 0 }
  if (offset.y + vierow > grirow) { offset.y = grirow - vierow }

  // Global settings
  view.context.textAlign = 'center'
  view.context.textBaseline = 'middle'

  // Need to do this first since some symbols are wide enought to take several cells
  for (var row = 0; row  < vierow; ++row) {
    for (var col = 0; col < viecol; ++col) {
      // Center the Grid if it«s smaller than the View
      var _col = col + (gricol < viecol ? Math.ceil(offset.x / 2) : offset.x)
      var _row = row + (grirow < vierow ? Math.ceil(offset.y / 2) : offset.y)

      // Ignore values outside the Grid
      if (_row < 0 || _row > grirow - 1 || _col < 0 || _col > gricol - 1) { continue }

      // Calculate the Position and get the Cell
      var x = col * cesiz.width
      var y = row * cesiz.height
      var cell = grid.get(_col, _row)

      // Paint the Cell if it has a Background color
      var background = cell.background || gridef.background || viedef.background
      if (background) {
        view.context.fillStyle = background
        view.context.fillRect(x, y, cesiz.width, cesiz.height)
      }
    }
  }

  // Render every Cell within the View
  for (var row = 0; row  < vierow; ++row) {
    for (var col = 0; col < viecol; ++col) {
      // Center the Grid if it«s smaller than the View
      var _col = col + (gricol < viecol ? Math.ceil(offset.x / 2) : offset.x)
      var _row = row + (grirow < vierow ? Math.ceil(offset.y / 2) : offset.y)

      // Ignore values outside the Grid
      if (_row < 0 || _row > grirow - 1 || _col < 0 || _col > gricol - 1) { continue }

      context.save()

      // Calculate the Position and get the Cell
      var x = col * cesiz.width
      var y = row * cesiz.height
      var cell = grid.get(_col, _row)

      // Paint the Cell if it has a Background color
      // var background = cell.background || gridef.background || viedef.background
      // if (background) {
      //   view.context.fillStyle = background
      //   view.context.fillRect(x, y, cesiz.width, cesiz.height)
      // }

      // Show a border around each Cell if requested
      var showBorder = ShowBorders || gribor.visible || viebor.visible
      if (showBorder) {
        view.context.lineWidth = gribor.width || viebor.width
        view.context.strokeStyle = gribor.color || viebor.color
        view.context.strokeRect(x, y, cesiz.width, cesiz.height)
      }

      // Draw the Cells' (text) value, in the specified color (and font)
      var value = cell.value || gridef.value || viedef.value
      var font = cell.font || gridef.font || viedef.font || 'monospace'
      if (value) {
        x += horizontalOffset
        y += verticalOffset

        view.context.font = cesiz.height.toString() + 'px ' + font

        var stroke = cell.stroke || gridef.stroke || viedef.stroke
        var strokeWidth = cell.strokeWidth || gridef.strokeWidth || viedef.strokeWidth || 1
        if (stroke) {
          view.context.lineWidth = strokeWidth
          view.context.strokeStyle = stroke
          view.context.strokeText(value, x, y)
        }

        var fill = cell.fill || gridef.fill || viedef.fill || 'white'
        view.context.fillStyle = fill
        view.context.fillText(value, x, y)
      }

      context.restore()
    }
  }
}
