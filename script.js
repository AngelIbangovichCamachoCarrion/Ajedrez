document.addEventListener('DOMContentLoaded', () => {
    let board = null;
    const game = new Chess();
    const moveHistory = document.getElementById('move-history');
    let moveCount = 1;
    let userColor = 'w';

    const makeRandomMove = () => {
        if (game.game_over()) {
            checkForAlerts(); 
            return;
        }

        const possibleMoves = game.moves();
        if (possibleMoves.length === 0) {
            checkForAlerts();
            return;
        }

        const randomIdx = Math.floor(Math.random() * possibleMoves.length);
        const move = possibleMoves[randomIdx];
        game.move(move);
        board.position(game.fen());
        recordMove(move, moveCount);
        moveCount++;

        checkForAlerts();
    };

    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight;
    };

    const checkForAlerts = () => {
        if (game.in_checkmate()) {
            alert("¡Jaque mate!");
        } else if (game.in_check()) {
            alert("¡Estás en jaque!");
        } else if (game.in_stalemate()) {
            alert("¡Tablas por estancamiento!");
        } else if (game.in_threefold_repetition()) {
            alert("¡Tablas por repetición!");
        }
    };

    const onDragStart = (source, piece) => {
        return !game.game_over() && piece.startsWith(userColor);
    };

    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q',
        });

        if (move === null) return 'snapback';

        recordMove(move.san, moveCount);
        moveCount++;

        if (move.san === "O-O" || move.san === "O-O-O") {
            alert("¡Has hecho un enroque!");
        }

        checkForAlerts();

        if (!game.game_over()) {
            window.setTimeout(makeRandomMove, 250);
        }
    };

    const onSnapEnd = () => {
        board.position(game.fen());
    };

    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'fast',
        snapBackSpeed: 500,
        snapSpeed: 100,
    };

    board = Chessboard('board', boardConfig);

    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset();
        board.start();
        moveHistory.textContent = '';
        moveCount = 1;
        userColor = 'w';
    });

    document.querySelector('.set-pos').addEventListener('click', () => {
        const fen = prompt("Enter the FEN notation for the desired position!");
        if (fen !== null) {
            if (game.load(fen)) {
                board.position(fen);
                moveHistory.textContent = '';
                moveCount = 1;
                userColor = 'w';
            } else {
                alert("Notación FEN no válida. Por favor inténtalo de nuevo.");
            }
        }
    });

    document.querySelector('.flip-board').addEventListener('click', () => {
    board.flip();
    makeRandomMove();
    userColor = userColor === 'w' ? 'b' : 'w';
});

});
