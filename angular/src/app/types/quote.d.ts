import type { Subtask } from './subtask';

/**
 * Represents a quote object from the database
 */
export type QuoteResponse = {
	_id: string;
	subtasks: Subtask[];
	estimate: number;
	projectName: string;
};

/**
 * Represents a simple numerical of the calculated quote value
 */
export type EstimateResponse = {
	estimate: number;
};

export type EstimateResponseBulk = {
	estimates: number[]; // each subtask
	total: number;
};
