import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { User } from '../types/User';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly endpoint = 'http://localhost:3934/auth';

	private httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
		}),
	};

	constructor(private readonly http: HttpClient) {}

	createUser(newUser: User) {
		return this.http.post<string>(
			`${this.endpoint}/signup`,
			newUser,
			this.httpOptions
		);
	}
}
