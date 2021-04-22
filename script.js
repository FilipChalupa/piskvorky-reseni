let currentPlayer = 'circle'
const fields = document.querySelectorAll('.board__field')
const currentSymbol = document.querySelector('.current-player__symbol')
const boardSize = 10

for (let i = 0; i < fields.length; i++) {
	const field = fields[i]
	field.addEventListener('click', () => {
		field.classList.add(`board__field--${currentPlayer}`)
		field.disabled = true

		if (isWinningMove(field)) {
			let message = 'Vyhrál křížek!'
			if (currentPlayer === 'circle') {
				message = 'Vyhrálo kolečko!'
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

const getPosition = (field) => {
	let fieldIndex = 0
	while (fieldIndex < fields.length) {
		if (field === fields[fieldIndex]) {
			break
		}
		fieldIndex++
	}

	return {
		row: Math.floor(fieldIndex / boardSize),
		column: fieldIndex % boardSize,
	}
}

const getField = (row, column) => fields[row * boardSize + column]

const getSymbol = (field) => {
	if (field.classList.contains('board__field--cross')) {
		return 'cross'
	} else if (field.classList.contains('board__field--circle')) {
		return 'circle'
	}
}

const symbolsToWin = 5
const isWinningMove = (field) => {
	const origin = getPosition(field)
	const symbol = getSymbol(field)

	let i

	let inRow = 1 // Jednička pro právě vybrané políčko
	// Koukni doleva
	i = origin.column
	while (i > 0 && symbol === getSymbol(getField(origin.row, i - 1))) {
		inRow++
		i--
	}

	// Koukni doprava
	i = origin.column
	while (
		i < boardSize - 1 &&
		symbol === getSymbol(getField(origin.row, i + 1))
	) {
		inRow++
		i++
	}

	if (inRow >= symbolsToWin) {
		return true
	}

	let inColumn = 1
	// Koukni nahoru
	i = origin.row
	while (i > 0 && symbol === getSymbol(getField(i - 1, origin.column))) {
		inColumn++
		i--
	}

	// Koukni dolu
	i = origin.row
	while (
		i < boardSize - 1 &&
		symbol === getSymbol(getField(i + 1, origin.column))
	) {
		inColumn++
		i++
	}

	if (inColumn >= symbolsToWin) {
		return true
	}

	return false
}
