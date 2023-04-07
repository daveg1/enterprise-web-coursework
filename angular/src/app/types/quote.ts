import type { Budget } from './budget';

/**
 * Represents a quote object from the database
 */
export type QuoteResponse = {
	_id: string;
	budget: Budget;
	estimate: number;
	projectName: string;
};

/**
 * Represents a simple numerical of the calculated quote value
 */
export type EstimateResponse = {
	estimate: number;
};
