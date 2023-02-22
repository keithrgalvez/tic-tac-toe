var currentMove = 'X';

var reviewIndex = 0;
var moves = [];

const winning_combinations = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
];

const boxIdPrefix = 'box';

const createEl = (type, label, id, className, fn, hidden) => {
    let el = document.createElement(type);
    el.type = type;
    if (type == 'button' || type == 'label') {
        el.innerHTML = label;
    }
    if (fn) {
        el.onclick = function () {
            fn(this);
        };
    }

    el.id = id;
    el.className = className;
    el.hidden = hidden;
    return el;
};

const resetGame = (reset) => {
    let gridFields = document.querySelectorAll(".gridField");
    gridFields.forEach((field) => {
        field.disabled = false;
        field.value = '';
        field.classList.add('empty');
        field.classList.remove('match');
        field.classList.remove('review');
    });
    currentMove = 'X';
    reset.hidden = true;
    document.getElementById('divCurrentPlayer').hidden = true;
    document.getElementById('divWinner').hidden = true;
    document.getElementById('review').hidden = true;
    document.getElementById('reviewControls').hidden = true;
    review = [];
    moves = [];
};

const reviewGame = () => {
    document.getElementById('review').hidden = true;
    document.getElementById('reviewControls').hidden = false;
    document.getElementById('endReview').hidden = false;
    reviewIndex = moves.length-1;
    highlight(moves[reviewIndex], true);
    enableReviewControls();
};

const endReview = () => {
    let gridFields = document.querySelectorAll(".gridField");
    gridFields.forEach((field) => {
        field.classList.remove('review');
    });
    document.getElementById('review').hidden = false;
    document.getElementById('reviewControls').hidden = true;
    document.getElementById('endReview').hidden = true;
};

function highlight(move, highlight) {
    if (highlight) {
        document.getElementById(move[0]).classList.add('review');
    } else {
        document.getElementById(move[0]).classList.remove('review');
    }
}

function enableReviewControls() {
    document.getElementById('back').disabled = reviewIndex == 0;
    document.getElementById('forward').disabled = moves.length == reviewIndex+1;
}

const back = () => {
    highlight(moves[reviewIndex-1], true);
    highlight(moves[reviewIndex], false);
    reviewIndex--;
    enableReviewControls();
};

const forward = () => {
    highlight(moves[reviewIndex], false);
    highlight(moves[reviewIndex+1], true);
    reviewIndex++;
    enableReviewControls();
};

const checkCombinations = () => {
    const checkWinner = (val, ...tictactoe) => {
        let result = tictactoe.every((e) => e.value === val);
        if (result) {
            tictactoe.forEach((e) => e.classList.add('match'));
            document.getElementById('winner').innerHTML = val;
        }
        return result;
    };

    const checkDraw = () => {
        let emptyGrids = document.querySelectorAll(".empty");
        let draw = emptyGrids.length == 0;
        if (draw) {
            alert('Draw!!!');
            document.getElementById('divCurrentPlayer').hidden = true;
        }
        return draw;
    };

    let winner = winning_combinations.find((c) => {
        let tic = document.getElementById(boxIdPrefix + c[0]);
        let tac = document.getElementById(boxIdPrefix + c[1]);
        let toe = document.getElementById(boxIdPrefix + c[2]);
        return checkWinner('X', tic, tac, toe) || checkWinner('O', tic, tac, toe);
    });

    if (winner) {
        document.getElementById('divCurrentPlayer').hidden = true;
        document.getElementById('divWinner').hidden = false;
        document.getElementById('review').hidden = false;
        let gridFields = document.querySelectorAll(".gridField");
        gridFields.forEach((field) => field.disabled = true);
    } else {
        checkDraw();
    }
}

function renderGrid() {
    const setMove = (el) => {
        el.value = currentMove;
        el.disabled = true;
        el.classList.remove("empty");
        currentMove = currentMove == 'X' ? 'O' : 'X';
        document.getElementById("currentPlayer").innerHTML = currentMove;
        document.getElementById("reset").hidden = false;

        moves.push([el.id, el.value]);
        checkCombinations();
    }

    let idCount = 1;
    for (let i = 0; i < 3; i++) {
        for (let x = 0; x < 3; x++, idCount++) {
            let box = createEl("input", null, `box${idCount}`, "gridField empty", setMove, false);
            document.body.appendChild(box);
        }
        document.write("<br>");
    }
}

function renderLabels() {
    let divLabels = createEl('div', null, 'divLabels', 'divLabels', null, false);

    let divCurrentPlayer = createEl('div', null, 'divCurrentPlayer', 'divCurrentPlayer', null, false);
    let currentPlayerLbl = createEl('label', 'Next Move: Player ', 'lblCurrentPlayer', 'lblCurrentPlayer', null, false);
    let currentPlayerValue = createEl('label', currentMove, 'currentPlayer', 'currentPlayer', null, false);
    currentPlayerLbl.appendChild(currentPlayerValue);
    divCurrentPlayer.appendChild(currentPlayerLbl);
    document.body.appendChild(divCurrentPlayer);
    divLabels.appendChild(divCurrentPlayer);

    let divWinner = createEl('div', null, 'divWinner', 'divWinner', null, true);
    let winnerLbl = createEl('label', 'Tic Tac Toe!<br>Winner is Player ', 'lblWinner', 'lblWinner', null, false);
    let winnerValue = createEl('label', '', 'winner', 'winner', null, false);
    winnerLbl.appendChild(winnerValue);
    divWinner.appendChild(winnerLbl);
    divLabels.appendChild(divWinner);

    document.body.appendChild(divLabels);
}

function renderControls() {
    let divControls = createEl('div', null, 'divControls', 'divControls', null, false);

    let resetButton = createEl("button", "Restart", "reset", "reset", resetGame, true);
    divControls.appendChild(resetButton);

    let reviewButton = createEl("button", "Review", "review", "reviewBtn", reviewGame, true);
    divControls.appendChild(reviewButton);

    let endReviewButton = createEl("button", "End Review", "endReview", "endReviewBtn", endReview, true);
    divControls.appendChild(endReviewButton);

    let divReviewControls = createEl('div', null, 'reviewControls', 'reviewControls', null, true);
    let reviewBackButton = createEl("button", "<<", "back", "back", back);
    divReviewControls.appendChild(reviewBackButton);
    let reviewForwardButton = createEl("button", ">>", "forward", "forward", forward);
    divReviewControls.appendChild(reviewForwardButton);
    divControls.appendChild(divReviewControls);

    document.body.appendChild(divControls);
}

function init() {
    renderGrid();
    renderLabels();
    renderControls();
}

init();