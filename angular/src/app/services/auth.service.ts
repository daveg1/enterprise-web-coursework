import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import {
	AuthLogin,
	AuthResponse,
	AuthSignUp,
	AuthSignUpResponse,
	AuthState,
} from '../types/auth';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly endpoint = 'http://localhost:3934/auth';

	readonly userState$ = new BehaviorSubject<AuthState | null>(null);
	readonly isLoggedIn$ = new BehaviorSubject<boolean>(false);

	private httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
		}),
	};

	constructor(private readonly http: HttpClient) {
		const state = localStorage.getItem('state');

		if (state) {
			this.isLoggedIn$.next(true);
			this.userState$.next(JSON.parse(state));
		}
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
					// Set persistent state
					localStorage.setItem('state', JSON.stringify(response));

					// Update app states
					this.isLoggedIn$.next(true);
					this.userState$.next(response);
				})
			);
	}

	logout() {
		// Clear session and state
		localStorage.removeItem('state');

		this.isLoggedIn$.next(false);
		this.userState$.next(null);
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
