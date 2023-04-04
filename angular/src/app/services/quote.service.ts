import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import type { Budget } from '../types/budget';
import type { QuoteResponse, QuotesResponse } from '../types/quote';

@Injectable({
	providedIn: 'root',
})
export class QuoteService {
	constructor(private readonly http: HttpClient) {}

	private readonly endpoint = 'http://localhost:3934/quote';
	currentQuote$ = new BehaviorSubject<boolean>(false);

	private httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
		}),
	};

	calculateQuote(budget: Budget) {
		return this.http.post<QuoteResponse>(
			`${this.endpoint}/calculate`,
			budget,
			this.httpOptions
		);
	}

	saveQuote(budget: Budget, projectName: string, token: string) {
		return this.http
			.post(
				`${this.endpoint}/save`,
				{ budget, projectName, token },
				this.httpOptions
			)
			.pipe(
				tap((quote) => {
					this.currentQuote$.next(true);
				})
			);
	}

	getQuotesForUser(token: string) {
		return this.http.post<QuotesResponse>(
			`${this.endpoint}/user`,
			{ token },
			this.httpOptions
		);
	}
}
