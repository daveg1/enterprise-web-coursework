import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { User } from '../types/User';

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	private readonly endpoint = 'http://localhost:3934/account';

	private httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
		}),
	};

	constructor(private readonly http: HttpClient) {}

	createUser(newUser: User) {
		return this.http.post<string>(
			`${this.endpoint}/create`,
			newUser,
			this.httpOptions
		);
	}
}
