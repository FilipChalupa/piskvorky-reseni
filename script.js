let move = 'circle'

const fieldElements = document.querySelectorAll('.board__field')
const boardSize = Math.sqrt(fieldElements.length)
const symbolsToWin = 5

updateCurrentPlayerSymbol()

fieldElements.forEach((fieldElement, i) => {
	setTimeout(() => {
		fieldElement.style.animationPlayState = 'running'
	}, i * 8 + (i % boardSize) * 32)

	fieldElement.addEventListener('click', () => {
		if (getSymbolAtField(fieldElement)) {
			return
		}

		if (move === 'circle') {
			fieldElement.classList.add('board__field--circle')
			move = 'cross'
		} else {
			fieldElement.classList.add('board__field--cross')
			move = 'circle'
		}
		fieldElement.setAttribute('tabindex', -1)

		updateCurrentPlayerSymbol()

		const winner = findWinner()
		setTimeout(() => {
			if (winner === 'circle') {
				alert('Vyhrál kroužek')
			} else if (winner === 'cross') {
				alert('Vyhrál křížek')
			}
		})
	})
})

function updateCurrentPlayerSymbol() {
	const currentPlayerSymbolElement = document.querySelector(
		'.current-player__symbol',
	)

	currentPlayerSymbolElement.classList.remove('current-player__symbol--circle')
	currentPlayerSymbolElement.classList.remove('current-player__symbol--cross')
	currentPlayerSymbolElement.classList.add(`current-player__symbol--${move}`)
}

function getSymbolAtField(fieldElement) {
	if (fieldElement.classList.contains('board__field--circle')) {
		return 'circle'
	} else if (fieldElement.classList.contains('board__field--cross')) {
		return 'cross'
	}
}

function getSymbolAtPosition(row, column) {
	if (row < 0 || column < 0 || row >= boardSize || column >= boardSize) {
		return
	}
	return getSymbolAtField(fieldElements[row * boardSize + column])
}

function findWinnerInSeries(symbols) {
	let lastSymbol
	let lastSymbolCount = 0
	for (let currentSymbol of symbols) {
		if (lastSymbol === currentSymbol) {
			lastSymbolCount++
		} else {
			lastSymbolCount = 1
			lastSymbol = currentSymbol
		}

		if (lastSymbolCount === symbolsToWin && lastSymbol) {
			return lastSymbol
		}
	}
}

function findWinner() {
	// Check rows and columns
	for (let direction of ['rows', 'columns']) {
		for (let a = 0; a < boardSize; a++) {
			let series = []

			for (let b = 0; b < boardSize; b++) {
				const [row, column] = direction === 'rows' ? [b, a] : [a, b]
				series.push(getSymbolAtPosition(row, column))
				const winner = findWinnerInSeries(series)
				if (winner) {
					return winner
				}
			}
		}
	}

	// Check diagonals
	for (let direction of ['fromTopLeft', 'fromBottomLeft']) {
		for (let column = -boardSize; column < boardSize; column++) {
			let series = []

			for (
				let offsetAbsolute = 0;
				offsetAbsolute < boardSize;
				offsetAbsolute++
			) {
				series.push(
					getSymbolAtPosition(
						offsetAbsolute,
						column +
							(direction === 'fromTopLeft' ? offsetAbsolute : -offsetAbsolute),
					),
				)
				const winner = findWinnerInSeries(series)
				if (winner) {
					return winner
				}
			}
		}
	}

	// @TODO: handle tie
}
