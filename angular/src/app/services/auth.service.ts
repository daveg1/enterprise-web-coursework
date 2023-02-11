import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { AuthLogin, AuthSignUp } from '../types/auth';

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

	signup(user: AuthSignUp) {
		return this.http.post<string>(
			this.endpoint + '/signup',
			user,
			this.httpOptions
		);
	}

	login(user: AuthLogin) {
		return this.http.post(this.endpoint + '/login', user, this.httpOptions);
	}
}
