import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Budget } from '../types/Budget';
import type { QuoteResponse } from '../types/Quote';

@Injectable({
	providedIn: 'root',
})
export class BudgetService {
	private endpoint = 'http://localhost:3934/budget';

	private currencyFormat = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP',
	});

	private httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
		}),
	};

	constructor(private readonly http: HttpClient) {}

	getQuote(budget: Budget) {
		return this.http.post<QuoteResponse>(
			this.endpoint,
			budget,
			this.httpOptions
		);
	}

	formatAsCurrency(value: number) {
		return this.currencyFormat.format(value);
	}
}
