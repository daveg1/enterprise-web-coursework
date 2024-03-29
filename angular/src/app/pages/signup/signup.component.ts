import { Component, OnDestroy } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import type { AuthSignUp } from 'src/app/types/auth';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
})
export class SignupComponent implements OnDestroy {
	signupForm;
	response$ = new BehaviorSubject<string>('');

	private readonly unsubscribe$ = new Subject<void>();

	constructor(
		private readonly authService: AuthService,
		readonly fb: NonNullableFormBuilder,
		readonly router: Router
	) {
		if (this.authService.isLoggedIn$.value) {
			this.router.navigate(['/account']);
		}

		this.signupForm = this.fb.group({
			firstname: this.fb.control('', Validators.required),
			lastname: this.fb.control('', Validators.required),
			username: this.fb.control('', Validators.required),
			password: this.fb.control('', Validators.required),
		});
	}

	submitForm() {
		if (this.signupForm.valid) {
			this.authService
				.signup(this.signupForm.value as AuthSignUp)
				.pipe(takeUntil(this.unsubscribe$))
				.subscribe({
					next: (response) => {
						this.response$.next(
							`Account successfully created, ${response.firstname}!`
						);
					},

					error: (error) => {
						this.response$.next(error.message);
					},
				});
		} else {
			this.signupForm.markAllAsTouched();
		}
	}

	// Lifecycle

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
