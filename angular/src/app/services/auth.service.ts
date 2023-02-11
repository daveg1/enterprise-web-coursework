import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import type { AuthLogin, AuthResponse, AuthSignUp } from '../types/auth';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly endpoint = 'http://localhost:3934/auth';

	private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
	isLoggedIn$ = this._isLoggedIn$.asObservable();

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
		return this.http
			.post<AuthResponse>(this.endpoint + '/login', user, this.httpOptions)
			.pipe(
				tap((response) => {
					localStorage.setItem('token', response.token);
					this._isLoggedIn$.next(true);
				})
			);
	}

	logout() {
		localStorage.removeItem('token');
		this._isLoggedIn$.next(false);
	}
}
