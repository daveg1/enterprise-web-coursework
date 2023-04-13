import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Paygrade, PaygradeDialogForm } from '../types/paygrade';
import { AuthService } from './auth.service';
import { BehaviorSubject, Subject, takeUntil, tap } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class PaygradeService implements OnDestroy {
	private readonly endpoint = 'http://localhost:3934/paygrade';
	private readonly userState$;
	private readonly unsubscribe$ = new Subject<void>();

	readonly paygrades$ = new BehaviorSubject<Paygrade[]>([]);
	readonly roles$ = new BehaviorSubject<string[]>([]);

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
		this.getPaygrades().pipe(takeUntil(this.unsubscribe$)).subscribe();
		this.getRoles().pipe(takeUntil(this.unsubscribe$)).subscribe();
	}

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	getRoles() {
		return this.http
			.get<Paygrade['role'][]>(`${this.endpoint}/roles`)
			.pipe(tap((roles) => this.roles$.next(roles)));
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
