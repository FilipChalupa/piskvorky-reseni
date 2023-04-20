import { findWinner } from 'https://unpkg.com/piskvorky@0.1.4'
let currentPlayer = 'circle'

const currentPlayerSymbol = document.querySelector('.current-player__symbol')

const fields = document.querySelectorAll('.board__field')

document
	.querySelector('.controls__restart')
	.addEventListener('click', (event) => {
		if (confirm('Opravdu chceš začít znovu?') === false) {
			event.preventDefault()
		}
	})

const createBoard = () => {
	return Array.from(fields).map((field) => {
		if (field.classList.contains('board__field--circle')) {
			return 'o'
		}
		if (field.classList.contains('board__field--cross')) {
			return 'x'
		}
		return '_'
	})
}

const lockBoard = () => {
	fields.forEach((field) => {
		field.disabled = true
	})
}

const unlockBoard = () => {
	fields.forEach((field) => {
		if (
			!field.classList.contains('board__field--circle') &&
			!field.classList.contains('board__field--cross')
		) {
			field.disabled = false
		}
	})
}

const handleClick = async (event) => {
	const field = event.target
	field.classList.add(`board__field--${currentPlayer}`)
	field.disabled = true
	currentPlayerSymbol.classList.remove(
		`current-player__symbol--${currentPlayer}`,
	)

	if (currentPlayer === 'circle') {
		currentPlayer = 'cross'
	} else {
		currentPlayer = 'circle'
	}

	currentPlayerSymbol.classList.add(`current-player__symbol--${currentPlayer}`)

	const board = createBoard()

	const winner = findWinner(board)
	if (winner === 'o' || winner === 'x' || winner === 'tie') {
		setTimeout(() => {
			if (winner === 'o') {
				alert('Vyhrálo kolečko!')
			} else if (winner === 'x') {
				alert('Vyhrál křížek!')
			} else if (winner === 'tie') {
				alert('Hra skončila nerozhodně.')
			}
			location.reload()
		}, 500)
	} else if (currentPlayer === 'cross') {
		lockBoard()
		const response = await fetch(
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
		const {
			position: { x, y },
		} = await response.json()
		unlockBoard()
		fields[x + y * 10].click()
	}
}

fields.forEach((field) => {
	field.addEventListener('click', handleClick)
})
