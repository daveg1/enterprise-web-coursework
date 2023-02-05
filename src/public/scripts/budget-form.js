window.onload = (e) => {
	const formElem = document.querySelector('#budget-form')

	formElem.onsubmit = async (e) => {
		e.preventDefault()
		const data = new FormData(formElem)

		const body = {
			timeWorked: parseInt(data.get('timeWorked')),
			timeUnit: data.get('timeUnit').toString(),
			payGrade: data.get('payGrade').toString(),
			oneOffCost: parseInt(data.get('oneOffCost')),
			ongoingCost: parseInt(data.get('ongoingCost')),
			ongoingFrequency: data.get('ongoingFrequency').toString(),
		}

		const req = await fetch('/calculate', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		const res = await req.json()
		console.log(res)
	}
}
