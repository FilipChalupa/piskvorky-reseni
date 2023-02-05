import { findWinner, suggestNextMove } from 'https://unpkg.com/piskvorky@0.0.5'
let currentPlayer = 'circle'
const fields = document.querySelectorAll('.board__field')
const currentSymbol = document.querySelector('.current-player__symbol')
const boardSize = 10

const move = (field) => {
	field.classList.add(`board__field--${currentPlayer}`)
	field.disabled = true

	const board = []
	fields.forEach((field) => {
		if (field.classList.contains('board__field--circle')) {
			board.push(1)
		} else if (field.classList.contains('board__field--cross')) {
			board.push(2)
		} else {
			board.push(0)
		}
	})

	const winner = findWinner(board)

	if (winner === 0) {
		if (currentPlayer === 'circle') {
			const nextMove = suggestNextMove(board)
			const nextMoveIndex = nextMove.x + nextMove.y * boardSize
			setTimeout(() => {
				move(fields[nextMoveIndex])
			}, 500)
		}
	} else {
		let message = 'Remíza!'
		if (winner === 1) {
			message = 'Vyhrálo kolečko!'
		} else if (winner === 2) {
			message = 'Vyhrál křížek!'
		}

		setTimeout(() => {
			if (confirm(`${message} Spustit novou hru?`)) {
				location.reload()
			}
		}, 150)
	}

	currentSymbol.classList.remove(`current-player__symbol--${currentPlayer}`)
	if (currentPlayer === 'circle') {
		currentPlayer = 'cross'
	} else {
		currentPlayer = 'circle'
	}
	currentSymbol.classList.add(`current-player__symbol--${currentPlayer}`)
}

for (let i = 0; i < fields.length; i++) {
	const field = fields[i]
	field.addEventListener('click', () => {
		if (currentPlayer === 'circle') {
			move(field)
		}
	})

	// Bez zadání: ozdoba
	setTimeout(() => {
		field.style.animationPlayState = 'running'
	}, i * 8 + (i % boardSize) * 32)
}
