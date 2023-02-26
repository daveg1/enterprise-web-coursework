import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import type { AuthSignUp } from 'src/app/types/auth';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
})
export class SignupComponent {
	signupForm;
	response$ = new BehaviorSubject<string>('');

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
			this.authService.signup(this.signupForm.value as AuthSignUp).subscribe({
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
}
