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
	let totalCostOfWorkers = 0
	let overallProjectTime = 0

	for (const worker of body.workers) {
		let hoursNeeded = worker.timeWorked

		// Convert alternative units into hours
		if (worker.timeUnit === 'days') {
			hoursNeeded *= 24
		} else if (worker.timeUnit === 'months') {
			hoursNeeded *= 730
		}

		const hourlyRate = rates[worker.payGrade].hourly
		const costOfPerson = hoursNeeded * hourlyRate
		totalCostOfWorkers += costOfPerson

		if (hoursNeeded > overallProjectTime) {
			overallProjectTime = hoursNeeded
		}
	}

	const oneOffCost = body.oneOffCost
	let ongoingRate = body.ongoingCost

	if (body.ongoingFrequency === 'weekly') {
		const weeks = Math.ceil(overallProjectTime / 168)
		ongoingRate *= weeks
	} else {
		const months = Math.ceil(overallProjectTime / 730)
		ongoingRate *= months
	}

	return totalCostOfWorkers + oneOffCost + ongoingRate
}
