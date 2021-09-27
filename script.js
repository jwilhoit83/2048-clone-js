const board = document.getElementById('game-board')
const scoreContainer = document.getElementById('score')
const endGameContainer = document.getElementById('end-game-container')
const endGameOutcome = document.getElementById('end-game')
const endGameScore = document.getElementById('end-score')
const playBtn = document.getElementById('play-again')
let boardValues = []
let score = 0
const size = 4
let movesLeft = true
const classObj = {
  0: 'zero',
  2: 'two',
  4: 'four',
  8: 'eight',
  16: 'sixteen',
  32: 'thirty-two',
  64: 'sixty-four',
  128: 'one-twenty-eight',
  256: 'two-fifty-six',
  512: 'five-twelve',
  1024: 'ten-twenty-four',
  2048: 'twenty-forty-eight',
  4096: 'forty-ninety-six',
}

let previousScores = localStorage.getItem('previous')
  ? JSON.parse(localStorage.getItem('previous'))
  : []
let scoresListContainer = document.getElementById('scores-list')

startGame()

// clears all previous game data and starts a new game with a fresh board

function startGame() {
  resetBoard()

  for (let i = 0; i < size ** 2; i++) {
    const square = document.createElement('div')
    square.innerText = 0
    board.appendChild(square)
    boardValues.push(square.innerText)
  }
  boardValues = boardValues.map(Number)
  addNewSquare()
  addNewSquare()
  document.addEventListener('keyup', e => {
    if (e.code === 'ArrowUp') {
      if (e.repeat) return
      else swipeUp()
    } else if (e.code === 'ArrowRight') {
      if (e.repeat) return
      else swipeRight()
    } else if (e.code === 'ArrowDown') {
      if (e.repeat) return
      else swipeDown()
    } else if (e.code === 'ArrowLeft') {
      if (e.repeat) return
      else swipeLeft()
    }
  })
}

function resetBoard() {
  boardValues = []
  score = 0
  movesLeft = true
  board.innerHTML = ''
}

// adds a #2 to the board in a random empty spot

function addNewSquare() {
  if (boardValues.includes(0)) {
    const random = Math.floor(Math.random() * size ** 2)
    if (boardValues[random] === 0) {
      boardValues[random] = 2
      updateBoard()
    } else addNewSquare()
  }
}

// updates the values of the tiles and checks for end game scenarios

function updateBoard() {
  checkForMoves()

  boardValues.forEach((val, idx) => {
    board.children[idx].innerText = val
    board.children[idx].className = classObj[val]
  })

  scoreContainer.innerText = score

  if (Math.max(...boardValues) >= 2048 && !movesLeft) {
    previousScores.push(score)
    localStorage.setItem('previous', JSON.stringify(previousScores))
    populateTopScores()
    endGameContainer.style.display = 'flex'
    endGameOutcome.innerText = 'You Win!!!'
    endGameScore.innerText = score
  } else if (!movesLeft) {
    previousScores.push(score)
    localStorage.setItem('previous', JSON.stringify(previousScores))
    populateTopScores()
    endGameContainer.style.display = 'flex'
    endGameOutcome.innerText = 'No Moves Left!!!'
    endGameScore.innerText = score
  }
}

// functions to handle directional movement on the game board

function swipeLeft() {
  let newValues = []
  for (let i = 0; i < size ** 2; i++) {
    if (i % 4 === 0) {
      let values = boardValues.slice(i, i + 4).filter(num => num > 0)
      values = addPairs(values)
      let empties = new Array(size - values.length).fill(0)
      values = [...values, ...empties]
      values.forEach(val => newValues.push(val))
    }
  }
  if (boardValues.join('') === newValues.join('')) {
    return
  } else {
    boardValues = newValues.slice()
    addNewSquare()
  }
}

function swipeRight() {
  let newValues = []
  for (let i = 0; i < size ** 2; i++) {
    if (i % 4 === 0) {
      let values = boardValues.slice(i, i + 4).filter(num => num > 0)
      values = addPairs(values, 'reverse')
      let empties = new Array(size - values.length).fill(0)
      values = [...empties, ...values]
      values.forEach(val => newValues.push(val))
    }
  }

  if (boardValues.join('') === newValues.join('')) {
    return
  } else {
    boardValues = newValues.slice()
    addNewSquare()
  }
}

function swipeUp() {
  let tempValues = []
  let newValues = []
  for (let i = 0; i < size; i++) {
    let values = []
    for (let j = i; j < size ** 2; j += size) {
      values.push(boardValues[j])
    }
    values = values.filter(num => num > 0)
    values = addPairs(values)
    let empties = new Array(size - values.length).fill(0)
    values = [...values, ...empties]
    values.forEach(val => tempValues.push(val))
  }

  for (let i = 0; i < size; i++) {
    newValues.push(
      tempValues[i],
      tempValues[i + size],
      tempValues[i + size * 2],
      tempValues[i + size * 3]
    )
  }

  if (boardValues.join('') === newValues.join('')) {
    return
  } else {
    boardValues = newValues.slice()
    addNewSquare()
  }
}

function swipeDown() {
  let tempValues = []
  let newValues = []
  for (let i = 0; i < size; i++) {
    let values = []
    for (let j = i; j < size ** 2; j += size) {
      values.push(boardValues[j])
    }
    values = values.filter(num => num > 0)
    values = addPairs(values, 'reverse')
    let empties = new Array(size - values.length).fill(0)
    values = [...empties, ...values]
    values.forEach(val => tempValues.push(val))
  }

  for (let i = 0; i < size; i++) {
    newValues.push(
      tempValues[i],
      tempValues[i + size],
      tempValues[i + size * 2],
      tempValues[i + size * 3]
    )
  }

  if (boardValues.join('') === newValues.join('')) {
    return
  } else {
    boardValues = newValues.slice()
    addNewSquare()
  }
}

// add pairs on the gameboard in the correct order depending on which direction is chosen

function addPairs(arr, direction = 'forward') {
  if (arr.length > 0) {
    let values = direction === 'reverse' ? arr.slice().reverse() : arr.slice()
    let res = []

    for (let i = 0; i <= values.length - 1; i++) {
      if (values[i] === values[i + 1]) {
        res.push(values[i] * 2)
        score += values[i] * 2
        i++
      } else {
        res.push(values[i])
      }
    }

    res = direction === 'forward' ? res : res.reverse()

    return res
  } else return []
}

// check to see if any valid moves are left on the board

function checkForMoves() {
  let pairs = false
  let blankSpaces = boardValues.includes(0)

  for (let i = 0; i < boardValues.length; i += size) {
    if (
      boardValues[i] === boardValues[i + 1] ||
      boardValues[i + 1] === boardValues[i + 2] ||
      boardValues[i + 2] === boardValues[i + 3]
    ) {
      pairs = true
    }
  }

  for (let i = 0; i < size; i++) {
    if (
      boardValues[i] === boardValues[i + size] ||
      boardValues[i + size] === boardValues[i + size * 2] ||
      boardValues[i + size * 2] === boardValues[i + size * 3]
    ) {
      pairs = true
    }
  }

  movesLeft = pairs || blankSpaces ? true : false
}

function populateTopScores() {
  previousScores.sort((a, b) => b - a)
  scoresListContainer.innerHTML = ''

  // let tempScores

  previousScores.slice(0, 10).forEach(score => {
    let item = document.createElement('li')
    item.innerText = score
    scoresListContainer.appendChild(item)
  })
}

// component event listeners

playBtn.addEventListener('click', e => {
  e.preventDefault()
  endGameContainer.style.display = 'none'
  startGame()
})
