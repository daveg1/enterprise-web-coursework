import { Paygrade } from '../models/paygrade.model'
import type { Subtask } from '../types/subtask'

/**
 * Generates a fudge factor plus or minus the given percentage
 *
 * E.g. factor = 0.05, generates a number between 0.95 and 1.05
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_number_between_two_values
 * @param factor Percentage
 * @returns number
 */
function fudgeFactor(factor: number, useFudge: boolean) {
	if (!useFudge) {
		return 1
	}

	const min = 1 - factor
	const max = 1 + factor
	return Math.random() * (max - min) + min
}

/**
 * Calculates the estimate quote given a subtask form
 * @param subtask The subtask form
 * @param useFudge Whether to calculate using the fudge factor. True by default
 * @returns Estimate
 */
export async function calculateQuote(subtask: Subtask, useFudge = true): Promise<number> {
	const paygrades = await Paygrade.find()

	if (!paygrades.length) {
		throw new Error('no paygrades available')
	}

	let totalCostOfWorkers = 0

	// Tally up workers
	for (const worker of subtask.workers) {
		let hoursNeeded = worker.timeWorked

		// Convert alternative units into hours
		if (worker.timeUnit === 'days') {
			hoursNeeded *= 24
		} else if (worker.timeUnit === 'months') {
			hoursNeeded *= 730
		}

		const paygrade = paygrades.find((pay) => pay.role === worker.payGrade)

		if (!paygrade) {
			throw new Error('That paygrade does not exist')
		}

		const hourlyRate = paygrade.hourlyRate
		const costOfPerson = hoursNeeded * hourlyRate
		totalCostOfWorkers += costOfPerson * fudgeFactor(0.05, useFudge) // ±0.05%
	}

	// Tally up one-off costs
	let totalOneOffCost = 0

	for (const oneOffCost of subtask.oneOffCosts) {
		totalOneOffCost += oneOffCost.cost
	}

	// Tally up ongoing costs
	let totalOngoingCosts = 0

	for (const ongoingCost of subtask.ongoingCosts) {
		totalOngoingCosts += ongoingCost.cost * ongoingCost.amount
	}

	return totalCostOfWorkers + totalOneOffCost + totalOngoingCosts
}
