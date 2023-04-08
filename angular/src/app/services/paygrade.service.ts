import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paygrade } from '../types/paygrade';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root',
})
export class PaygradeService {
	constructor(
		private readonly http: HttpClient,
		private readonly authService: AuthService
	) {}

	private readonly endpoint = 'http://localhost:3934/paygrade';

	private httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
		}),
	};

	getPaygrades() {
		return this.http.get<Paygrade[]>(`${this.endpoint}/all`);
	}
}
