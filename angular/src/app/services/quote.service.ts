import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Budget } from '../types/Budget';
import type { QuoteResponse } from '../types/Quote';

@Injectable({
	providedIn: 'root',
})
export class QuoteService {
	private readonly endpoint = 'http://localhost:3934/budget';

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
}