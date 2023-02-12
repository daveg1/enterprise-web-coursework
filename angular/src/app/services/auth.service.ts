import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import type {
	AuthLogin,
	AuthResponse,
	AuthSignUp,
	AuthSignUpResponse,
} from '../types/auth';

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

	constructor(private readonly http: HttpClient) {
		const token = localStorage.getItem('token');
		this._isLoggedIn$.next(!!token);
	}

	signup(user: AuthSignUp) {
		return this.http
			.post<AuthSignUpResponse>(
				this.endpoint + '/signup',
				user,
				this.httpOptions
			)
			.pipe(catchError(this.handleError));
	}

	login(user: AuthLogin) {
		return this.http
			.post<AuthResponse>(this.endpoint + '/login', user, this.httpOptions)
			.pipe(
				catchError(this.handleError),
				tap((response) => {
					localStorage.setItem('token', response.token);
					localStorage.setItem('username', response.username);
					this._isLoggedIn$.next(true);
				})
			);
	}

	logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('username');
		this._isLoggedIn$.next(false);
	}

	private handleError(response: HttpErrorResponse) {
		if (response.status === 400) {
			return throwError(() => new Error(response.error.reason));
		}

		return throwError(
			() =>
				new Error('Sorry, there was a problem on our end. Please try again.')
		);
	}
}
