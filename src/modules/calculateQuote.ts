import { Budget } from '../schemas/budget.schema'

const rates = {
	junior: {
		hourly: 10,
		annual: 20000,
	},
	standard: {
		hourly: 20,
		annual: 40000,
	},
	senior: {
		hourly: 30,
		annual: 60000,
	},
}

export function calculateQuote(body: Budget) {
	let hoursNeeded = body.timeWorked

	// Convert alternative units into hours
	if (body.timeUnit === 'days') {
		hoursNeeded *= 24
	} else if (body.timeUnit === 'months') {
		hoursNeeded *= 730
	}

	const hourlyRate = rates[body.payGrade].hourly
	const costPerPerson = hoursNeeded * hourlyRate

	const oneOffCost = body.oneOffCost
	let ongoingRate = body.ongoingCost

	if (body.ongoingFrequency === 'weekly') {
		const weeks = Math.floor(hoursNeeded / 168)
		ongoingRate *= weeks
	} else {
		const months = Math.floor(hoursNeeded / 730)
		ongoingRate *= months
	}

	return costPerPerson + oneOffCost + ongoingRate
}
