import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paygrade, PaygradeDialogForm } from '../types/paygrade';
import { AuthService } from './auth.service';
import { BehaviorSubject, Subject, takeUntil, tap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class PaygradeService {
	private readonly userState$;
	private readonly endpoint = 'http://localhost:3934/paygrade';
	readonly paygrades$ = new BehaviorSubject<Paygrade[]>([]);

	private httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
		}),
	};

	constructor(
		private readonly http: HttpClient,
		private readonly authService: AuthService
	) {
		this.userState$ = this.authService.userState$;
	}

	getPaygrades() {
		return this.http
			.get<Paygrade[]>(`${this.endpoint}/all`)
			.pipe(tap((paygrades) => this.paygrades$.next(paygrades)));
	}

	addPaygrade(paygrade: PaygradeDialogForm) {
		const { role, hourlyRate } = paygrade;

		return this.http.post<Paygrade>(
			`${this.endpoint}/new`,
			{
				role,
				hourlyRate,
				token: this.userState$.value!.token,
			},
			this.httpOptions
		);
	}

	deletePaygrade(paygradeId: string) {
		return this.http.post(
			`${this.endpoint}/delete`,
			{
				paygradeId,
				token: this.userState$.value!.token,
			},
			this.httpOptions
		);
	}
}
