import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, of, tap } from 'rxjs';
import type { Budget } from '../types/budget';
import type { QuoteResponse, QuoteWholeResponse } from '../types/quote';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root',
})
export class QuoteService {
	constructor(
		private readonly http: HttpClient,
		private readonly authService: AuthService
	) {}

	private readonly endpoint = 'http://localhost:3934/quote';

	/**
	 * @todo refactor to use QuoteWholeResponse
	 */
	currentQuote$ = new BehaviorSubject<QuoteWholeResponse | null>(null);
	quotes$ = new BehaviorSubject<QuoteWholeResponse[]>([]);
	editing$ = new BehaviorSubject<string>('');

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

	saveQuote(budget: Budget, projectName: string) {
		const state = this.authService.userState$.value;

		return this.http
			.post<QuoteWholeResponse>(
				`${this.endpoint}/save`,
				{ budget, projectName, token: state!.token },
				this.httpOptions
			)
			.pipe(
				tap((quote) => {
					this.currentQuote$.next(quote);
				})
			);
	}

	updateQuote(id: string, budget: Budget) {
		const state = this.authService.userState$.value;

		return this.http
			.post<QuoteWholeResponse>(`${this.endpoint}/update`, {
				id,
				budget,
				token: state!.token,
			})
			.pipe(
				tap((quote) => {
					this.currentQuote$.next(quote);
				})
			);
	}

	getQuotesForUser(token: string) {
		return this.http
			.post<QuoteWholeResponse[]>(
				`${this.endpoint}/user`,
				{ token },
				this.httpOptions
			)
			.pipe(
				tap((quotes) => {
					this.quotes$.next(quotes);
				})
			);
	}

	getQuoteById(id: string) {
		return this.http
			.post<QuoteWholeResponse>(`${this.endpoint}/id`, { id }, this.httpOptions)
			.pipe(
				tap((quote) => {
					this.currentQuote$.next(quote);
				})
			);
	}

	deleteQuote(id: string) {
		return this.http.post<boolean>(
			`${this.endpoint}/delete`,
			{ id },
			this.httpOptions
		);
	}
}
