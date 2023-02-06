function formatAsCurrency(value) {
	return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value)
}

window.onload = (e) => {
	const formElem = document.querySelector('#budget-form')
	const outputElem = document.querySelector('#output')

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

		outputElem.textContent = `Your quote: ${formatAsCurrency(res.quote)}`
	}
}
