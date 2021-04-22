let currentPlayer = 'circle'
const fields = document.querySelectorAll('.board__field')
const currentSymbol = document.querySelector('.current-player__symbol')

for (let i = 0; i < fields.length; i++) {
	const field = fields[i]
	field.addEventListener('click', () => {
		field.classList.add(`board__field--${currentPlayer}`)
		field.disabled = true

		currentSymbol.classList.remove(`current-player__symbol--${currentPlayer}`)
		if (currentPlayer === 'circle') {
			currentPlayer = 'cross'
		} else {
			currentPlayer = 'circle'
		}
		currentSymbol.classList.add(`current-player__symbol--${currentPlayer}`)
	})
}
