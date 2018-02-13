// Javascript Text Terminal Simulator
// Version 4.0
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

// Cell CSS Parameters, same as (value = '_', fill = '#_', background = '#_', font = '_px bold monospace')
var Cell = function Cell (value = undefined, fill = undefined, background = undefined, font = undefined) {
    return {
    'value': value,
    'fill': fill,
    'background': background,
    'font': font,
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

  // Resize the Grid, updating its cells, cols and rows
  this.resize = function resize (cols, rows) {
    _cells = new Array(rows)
    for (var row = 0; row < rows; ++row) {
      _cells[row] = new Array(cols)
      for (var col = 0; col < cols; ++col) {
        _cells[row][col] = {}
      }
    }
    _cols = cols
    _rows = rows
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
    if (row < 0 || row > _rows) { return }
    if (col < 0 || col > _cols) { return }
    _cells[row][col] = props
  }

  // Get the value of a Cell
  this.get = function get (col, row) {
    if (row < 0 || row > _rows) { return }
    if (_rows < 1 || col < 0 || col > _cols) { return }
    return _cells[row][col]
  }

  // Initialize the Grid
  this.resize(cols, rows)
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

  // Add the Border
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
Jerboa.render = function (grid, view, offset = Point(0, 0), showGrid = false) {
  if (grid === undefined || !(grid instanceof Jerboa.grid)) {
    console.error('Jerboa.render', 'Grid ' + (grid === undefined ? 'is not defined' : 'is not a JesboaGrid'))
    return
  }

  var halfCW = Math.floor(View.cellWidth / 2)
  var halfCH = Math.floor(View.cellHeight / 2)

  // Global settings
  view.context.textAlign = 'center'
  view.context.textBaseline = 'middle'

  // Render every Cell within the View
  for (var row = 0; row  < View.rows; ++row) {
    for (var col = 0; col < View.cols; ++col) {
      // Center the Grid if it«s smaller than the View
      var _col = col + (grid.cols() < view.cols ? Math.ceil(offset.x / 2) : offset.x)
      var _row = row + (grid.rows() < view.rows ? Math.ceil(offset.y / 2) : offset.y)

      // Ignore values outside the grid
      if (_row < 0 || _row > grid.rows() - 1 || _col < 0 || _col > grid.cols() - 1) { continue }

      context.save()

      // Calculate the Position and get the Cell
      var x = col * View.cellWidth
      var y = row * View.cellHeight
      var cell = grid.get(_col, _row)

      // Paint the Cell if it has a Background color
      if (cell.background !== undefined || View.default.background !== undefined) {
        view.context.fillStyle = cell.background === undefined ? View.default.background : cell.background
        view.context.fillRect(x, y, View.cellWidth, View.cellHeight)
      }

      // Show a Grid if it was requested
      if (showGrid) {
        view.context.lineWidth = 2
        view.context.strokeStyle = View.grid.stroke
        view.context.strokeRect(x, y, View.cellWidth, View.cellHeight)
      }

      // Draw the Cells' text value if it has one, in the font/color specified
      if (cell.value !== undefined && cell.value.length > 0) {
        view.context.font = cell.font === undefined ? View.default.font : cell.font
        view.context.fillStyle = cell.fill === undefined ? View.default.fill : cell.fill
        view.context.fillText(cell.value, x + halfCW, y + halfCH)
      }

      context.restore()
    }
  }
}

// Calculate the Offset based on a Grid, a View and a center Point
Jerboa.offset = function _offsetFromPoint (grid, view, center) {
  var offset = { 'x': 0, 'y': 0 }

  if (grid === undefined || !(grid instanceof Jerboa.grid)) {
    console.warn('Jerboa.offsetFromPoint', 'Grid ' + (grid === undefined ? 'is not defined' : 'is not a JesboaGrid'))
    return offset
  }

  offset.x = center.x - Math.floor(view.cols / 2)
  if (offset.x < 0) { offset.x = 0 }
  if (offset.x + view.cols > grid.cols()) { offset.x = grid.cols() - view.cols }
  offset.y = center.y - Math.floor(view.rows / 2)
  if (offset.y < 0) { offset.y = 0 }
  if (offset.y + view.rows > grid.rows()) { offset.y = grid.rows() - view.rows }
  return offset
}
