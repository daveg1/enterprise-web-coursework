import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { Budget } from '../types/Budget';
import type { QuoteResponse } from '../types/Quote';

@Injectable({
	providedIn: 'root',
})
export class QuoteService {
	private readonly endpoint = 'http://localhost:3934/quote';
	private _currentQuote = new BehaviorSubject<boolean>(false);
	currentQuote$ = this._currentQuote.asObservable();

	setCurrentQuote(value: boolean) {
		this._currentQuote.next(value);
	}

	private httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
		}),
	};

	constructor(private readonly http: HttpClient) {}

	calculateQuote(budget: Budget) {
		return this.http.post<QuoteResponse>(
			`${this.endpoint}/calculate`,
			budget,
			this.httpOptions
		);
	}

	saveQuote(budget: Budget, projectName: string, token: string) {
		return this.http.post(
			`${this.endpoint}/save`,
			{ budget, projectName, token },
			this.httpOptions
		);
	}

	getQuotesForUser(token: string) {
		return this.http.post(`${this.endpoint}/user`, { token }, this.httpOptions);
	}
}
