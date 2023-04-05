import type { Budget } from '../types/budget'

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

/**
 * Generates a fudge factor plus or minus the given percentage
 *
 * E.g. factor = 0.05, generates a number between 0.95 and 1.05
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_number_between_two_values
 * @param factor Percentage
 * @returns number
 */
function fudgeFactor(factor: number) {
	const min = 1 - factor
	const max = 1 + factor
	return Math.random() * (max - min) + min
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
		totalCostOfWorkers += costOfPerson * fudgeFactor(0.05) // ±0.05%
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
