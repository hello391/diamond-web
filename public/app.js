const grid = document.querySelector('.grid');
const width = 10;
let squares = Array.from(document.querySelectorAll('.grid div'));
const scoreDisplay = document.querySelector('#score')
const startBtn = document.querySelector('#start-button')
let currentPosition = 4;
let currentRotation = 0;
let nextRandom = 0;
let timerId;
let score = 0;
const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
];

// The Tetrominoes 
const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2, width * 2 + 1],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
];

const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
];

const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
];

const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
];

const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
];

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

//randomly select a Tetromino and its first rotation
let random = Math.floor(Math.random() * theTetrominoes.length);
let current = theTetrominoes[random][currentRotation];

// draw the tetromino
function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
        squares[currentPosition + index].style.backgroundColor = colors[random];
    })
}

// undraw the tetromino
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
        squares[currentPosition + index].style.backgroundColor = "";
    })
}

//assign functions to keyCodes
function control(e) {
    if (e.keyCode === 37) {
        moveLeft();
    } else if (e.keyCode === 38) {
        rotate();
    } else if (e.keyCode === 39) {
        moveRight();
    } else if (e.keyCode === 40) {
        moveDown();
    }
}
document.addEventListener('keyup', control)

// move down function
function moveDown() {
    displayLogs();
    undraw();
    currentPosition += width;
    draw();
    freeze();
}

//freeze
function freeze() {
    // if the next frame will be in the taken divs, stop moving it
    // game board starts with 10 taken divs below
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        squares[currentPosition].classList.remove('currentPosition');
        // start a new tetromino falling
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4
        draw();
        displayShape(); // draw the shape in the mini grid. these function names suck
        addScore();
        gameOver();
    }
}

//move the tetromino left, unless it is at the edge or there is a blockage 	
function moveLeft() {
    displayLogs();
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if (!isAtLeftEdge) currentPosition -= 1;

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1;
    }

    draw();
}

//move the tetromino right, unless it is at the edge or there is a blockage
function moveRight() {
    displayLogs();

    //perform checks before undrawing
    const isAtRightEdge = current.some(index => (currentPosition + index + 1) % width === 0)
    if (!isAtRightEdge) {
        undraw();
        currentPosition += 1;
    }

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1;
    }

    draw();
}

function displayLogs() {
    console.log('currentPosition (div array index) :', currentPosition);
    console.log('current (block description coordinates) :', current);
}

//rotate the tetromino
function rotate() {
    undraw();
    // need to add some checking to make sure we can't rotate into existing taken squares
    currentRotation++;

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentRotation -= 1;
    }

    if (currentRotation === current.length) {
        currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
}

// mini-grid
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4;
const displayIndex = 0;

//the Tetrominos without rotations
const upNextTetrominos = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // l
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // z
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // t
    [0, 1, displayWidth, displayWidth + 1], // o
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // i	
]

// display the shape in the mini-grid
function displayShape() {
    // erase any tetromino styling from the grid by purging each grid square of the tetromino class
    displaySquares.forEach(square => {
        square.classList.remove('tetromino');
        square.style.backgroundColor = '';
    })
    upNextTetrominos[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino');
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    })
}

//add functionaluty to the start-button
startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId);
        timerId = null
    } else {
        draw();
        timerId = timerId = setInterval(moveDown, 500);
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        displayShape();
    }
})

//add score && remove full rows
function addScore() {
    // outter for loop is a row index
    for (let i = 0; i < 190; i += width) {
        // create a row const to be iterated over with .every()
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
        // use the contents of row to index into game board (squares) and check for 'taken'
        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
                squares[index].style.backgroundColor = '';
            })
            // cut the full rows out
            const squaresRemoved = squares.splice(i, width);
            // concat the remaining game board to the removed rows
            // ie. insert the removed rows at the top of the board
            squares = squaresRemoved.concat(squares);
            // put all the divs back in the grid container
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}

//game over
function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = `the game ended your score was: ${score}`;
        clearInterval(timerId);
        alert("GAME OVER SCORE: " + score)
    }
}