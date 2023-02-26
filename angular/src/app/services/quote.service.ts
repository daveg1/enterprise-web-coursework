import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { Budget } from '../types/Budget';
import type { QuoteResponse } from '../types/Quote';

@Injectable({
	providedIn: 'root',
})
export class QuoteService {
	private readonly endpoint = 'http://localhost:3934/budget';
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

	getQuote(budget: Budget) {
		return this.http.post<QuoteResponse>(
			this.endpoint,
			budget,
			this.httpOptions
		);
	}
}
