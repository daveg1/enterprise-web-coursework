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

function fudgeFactor(value: number) {
	return value * Math.min(Math.random(), 0.7)
}

export function calculateQuote(budget: Budget) {
	let totalCostOfWorkers = 0

	// Tally up workers
	for (const worker of budget.workers) {
		let hoursNeeded = worker.timeWorked

		// Convert alternative units into hours
		if (worker.timeUnit === 'days') {
			hoursNeeded *= 24
		} else if (worker.timeUnit === 'months') {
			hoursNeeded *= 730
		}

		const hourlyRate = rates[worker.payGrade].hourly
		const costOfPerson = hoursNeeded * hourlyRate
		totalCostOfWorkers += fudgeFactor(costOfPerson)
	}

	// Tally up one-off costs
	let totalOneOffCost = 0

	for (const oneOffCost of budget.oneOffCosts) {
		totalOneOffCost += oneOffCost.cost
	}

	// Tally up ongoing costs
	let totalOngoingCosts = 0

	for (const ongoingCost of budget.ongoingCosts) {
		totalOngoingCosts += ongoingCost.cost * ongoingCost.amount
	}

	return totalCostOfWorkers + totalOneOffCost + totalOngoingCosts
}
