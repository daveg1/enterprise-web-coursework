import type { Budget } from './budget';

export type QuotesResponse = {
	quotes: {
		_id: string;
		budget: Budget;
		projectName: string;
	}[];
};

export type QuoteResponse = {
	quote: number;
};
