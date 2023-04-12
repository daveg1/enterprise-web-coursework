import { Component, OnDestroy } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AuthLogin } from 'src/app/types/auth';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
})
export class LoginComponent implements OnDestroy {
	loginForm;
	response$ = new BehaviorSubject<string>('');

	private readonly unsubscribe$ = new Subject<void>();

	constructor(
		private readonly authService: AuthService,
		readonly fb: NonNullableFormBuilder,
		readonly router: Router
	) {
		this.loginForm = this.fb.group({
			username: this.fb.control<string>('', Validators.required),
			password: this.fb.control<string>('', Validators.required),
		});

		this.loginForm.controls['username'].errors;
	}

	submitForm() {
		if (this.loginForm.valid) {
			this.authService
				.login(this.loginForm.value as AuthLogin)
				.pipe(takeUntil(this.unsubscribe$))
				.subscribe({
					next: () => {
						this.router.navigate(['/account']);
					},

					error: (error) => {
						this.response$.next(error.message);
					},
				});
		} else {
			this.loginForm.markAllAsTouched();
		}
	}

	// Lifecycle

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
