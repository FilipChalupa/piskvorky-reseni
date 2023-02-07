let currentPlayer = 'circle'
const fields = document.querySelectorAll('.board__field')
const currentSymbol = document.querySelector('.current-player__symbol')
const boardSize = 10

const move = (field) => {
	field.classList.add(`board__field--${currentPlayer}`)
	field.disabled = true

	currentSymbol.classList.remove(`current-player__symbol--${currentPlayer}`)
	if (currentPlayer === 'circle') {
		currentPlayer = 'cross'
	} else {
		currentPlayer = 'circle'
	}
	currentSymbol.classList.add(`current-player__symbol--${currentPlayer}`)

	const board = []
	fields.forEach((field) => {
		if (field.classList.contains('board__field--circle')) {
			board.push('o')
		} else if (field.classList.contains('board__field--cross')) {
			board.push('x')
		} else {
			board.push('_')
		}
	})

	// @TODO: disable moves while fetching
	fetch('https://piskvorky.czechitas-podklady.cz/api/find-winner', {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
		},
		body: JSON.stringify({
			board,
		}),
	})
		.then((response) => response.json())
		.then(({ winner }) => {
			if (winner === null) {
				if (currentPlayer === 'cross') {
					fetch(
						'https://piskvorky.czechitas-podklady.cz/api/suggest-next-move',
						{
							method: 'POST',
							headers: {
								'Content-type': 'application/json',
							},
							body: JSON.stringify({
								board,
								player: 'x',
							}),
						},
					)
						.then((response) => response.json())
						.then(({ position }) => {
							const fieldIndex = position.x + position.y * boardSize
							setTimeout(() => {
								move(fields[fieldIndex])
							}, 500)
						})
				}
			} else {
				let message = 'Remíza!'
				if (winner === 'o') {
					message = 'Vyhrálo kolečko!'
				} else if (winner === 'x') {
					message = 'Vyhrál křížek!'
				}

				setTimeout(() => {
					if (confirm(`${message} Spustit novou hru?`)) {
						location.reload()
					}
				}, 150)
			}
		})
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
