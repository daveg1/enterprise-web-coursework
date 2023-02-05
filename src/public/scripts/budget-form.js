window.onload = (e) => {
	const formElem = document.querySelector('#budget-form')

	formElem.onsubmit = async (e) => {
		e.preventDefault()
		const data = new URLSearchParams(new FormData(formElem))

		const req = await fetch('/calculate', {
			method: 'post',
			body: data,
		})

		const res = await req.json()
	}
}
