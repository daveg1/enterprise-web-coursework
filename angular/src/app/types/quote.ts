import type { Budget } from './budget';

/**
 * @todo rename this to QuoteReponse
 */
export type QuoteWholeResponse = {
	_id: string;
	budget: Budget;
	projectName: string;
};

/**
 * @deprecated please remove this
 */
export type QuoteResponse = {
	quote: number;
};
