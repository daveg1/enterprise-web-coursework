window.onload = (e) => {
	const formElem = document.querySelector('#signup-form')

	formElem.onsubmit = async (e) => {
		e.preventDefault()
		const data = new FormData(formElem)

		const req = await fetch('/signup', {
			method: 'post',
			body: data,
		})

		const res = await req.json()
		console.log(res)
	}
}
