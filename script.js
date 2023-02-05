import { findWinner } from 'https://unpkg.com/piskvorky@0.0.4/dist/index.es.js'
let currentPlayer = 'circle'
const fields = document.querySelectorAll('.board__field')
const currentSymbol = document.querySelector('.current-player__symbol')
const boardSize = 10

for (let i = 0; i < fields.length; i++) {
	const field = fields[i]
	field.addEventListener('click', () => {
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

		if (winner !== 0) {
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
	})

	// Bez zadání: ozdoba
	setTimeout(() => {
		field.style.animationPlayState = 'running'
	}, i * 8 + (i % boardSize) * 32)
}
