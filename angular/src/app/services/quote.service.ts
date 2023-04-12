import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import type { Budget } from '../types/budget';
import type { EstimateResponse, QuoteResponse } from '../types/quote';
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

	currentQuote$ = new BehaviorSubject<QuoteResponse | null>(null);
	currentEstimate$ = new BehaviorSubject<number>(0);
	quotes$ = new BehaviorSubject<QuoteResponse[]>([]);
	editing$ = new BehaviorSubject<string>('');
	hasChanges$ = new BehaviorSubject<boolean>(false);

	private httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
		}),
	};

	calculateQuote(budget: Budget) {
		return this.http.post<EstimateResponse>(
			`${this.endpoint}/calculate`,
			budget,
			this.httpOptions
		);
	}

	saveQuote(budget: Budget, projectName: string) {
		const state = this.authService.userState$.value;

		return this.http
			.post<QuoteResponse>(
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
			.post<QuoteResponse>(`${this.endpoint}/update`, {
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

	getQuotes() {
		const state = this.authService.userState$.value;

		return this.http
			.post<QuoteResponse[]>(
				`${this.endpoint}/user`,
				{ token: state!.token },
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
			.post<QuoteResponse>(`${this.endpoint}/id`, { id }, this.httpOptions)
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

	mergeQuotes(quoteIds: string[], projectName: string) {
		const state = this.authService.userState$.value;

		return this.http.post<QuoteResponse>(
			`${this.endpoint}/merge`,
			{ token: state!.token, quoteIds, projectName },
			this.httpOptions
		);
	}
}
