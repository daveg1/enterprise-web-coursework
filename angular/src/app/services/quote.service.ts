import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, tap } from 'rxjs';
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
	currentQuote$ = new BehaviorSubject<boolean>(false);
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

		if (!state) {
			return of('No state');
		}

		return this.http
			.post(
				`${this.endpoint}/save`,
				{ budget, projectName, token: state.token },
				this.httpOptions
			)
			.pipe(
				tap((quote) => {
					this.currentQuote$.next(true);
				})
			);
	}

	updateQuote(id: string, budget: Budget) {
		const state = this.authService.userState$.value;

		return this.http.post<QuoteWholeResponse>(`${this.endpoint}/update`, {
			id,
			budget,
			token: state!.token,
		});
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
		return this.http.post<QuoteWholeResponse>(
			`${this.endpoint}/id`,
			{ id },
			this.httpOptions
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
