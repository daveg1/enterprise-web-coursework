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

// Response from quote/calculateQuote
export type EstimateResponse = {
	estimate: number;
};

// Response from quote/calculateQuoteBulk
export type EstimateResponseBulk = {
	estimates: number[]; // each subtask
	total: number;
};

// Reponse from quote/update
export type UpdateQuoteResponse = {
	quote: QuoteResponse;
} & EstimateResponseBulk;
