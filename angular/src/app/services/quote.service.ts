import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import type { Subtask } from '../types/subtask';
import type {
	EstimateResponse,
	EstimateResponseBulk,
	QuoteResponse,
	UpdateQuoteResponse,
} from '../types/quote';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root',
})
export class QuoteService {
	private readonly userState$;

	constructor(
		private readonly http: HttpClient,
		private readonly authService: AuthService
	) {
		this.userState$ = this.authService.userState$;
	}

	private readonly endpoint = 'http://localhost:3934/quote';

	currentQuote$ = new BehaviorSubject<QuoteResponse | null>(null);
	currentEstimate$ = new BehaviorSubject<number>(0);
	quotes$ = new BehaviorSubject<QuoteResponse[]>([]);
	editing$ = new BehaviorSubject<string>('');

	private httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
		}),
	};

	calculateQuote(subtask: Subtask, useFudge: boolean) {
		return this.http.post<EstimateResponse>(
			`${this.endpoint}/calculate`,
			{ subtask, token: this.userState$.value?.token, useFudge },
			this.httpOptions
		);
	}

	calculateQuoteBulk(subtasks: Subtask[], useFudge: boolean) {
		return this.http.post<EstimateResponseBulk>(
			`${this.endpoint}/calculateBulk`,
			{ subtasks, token: this.userState$.value?.token, useFudge },
			this.httpOptions
		);
	}

	saveQuote(subtasks: Subtask[], projectName: string, useFudge: boolean) {
		return this.http
			.post<QuoteResponse>(
				`${this.endpoint}/save`,
				{
					subtasks,
					projectName,
					token: this.userState$.value?.token,
					useFudge,
				},
				this.httpOptions
			)
			.pipe(
				tap((quote) => {
					this.currentQuote$.next(quote);
				})
			);
	}

	updateQuote(id: string, subtasks: Subtask[], useFudge: boolean) {
		return this.http
			.post<UpdateQuoteResponse>(`${this.endpoint}/update`, {
				id,
				subtasks,
				token: this.userState$.value?.token,
				useFudge,
			})
			.pipe(
				tap((res) => {
					this.currentQuote$.next(res.quote);
				})
			);
	}

	getQuotes() {
		return this.http
			.post<QuoteResponse[]>(
				`${this.endpoint}/user`,
				{ token: this.userState$.value?.token },
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
		return this.http.post<QuoteResponse>(
			`${this.endpoint}/merge`,
			{ token: this.userState$.value?.token, quoteIds, projectName },
			this.httpOptions
		);
	}
}
