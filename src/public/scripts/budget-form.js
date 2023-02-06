function formatValue(value) {
	value = value.toString()
	let formatted = ''

	for (let i = 0; i < value.length; i++) {
		if (i !== 0 && i % 3 === 0) {
			formatted = ',' + formatted
		}
		formatted = value[value.length - i - 1] + formatted
	}

	return '£' + formatted
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

		outputElem.textContent = `Your quote: ${formatValue(res.quote)}`
	}
}
