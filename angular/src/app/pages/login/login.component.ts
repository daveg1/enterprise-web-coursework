import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AuthLogin } from 'src/app/types/auth';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
})
export class LoginComponent {
	loginForm;
	response$ = new BehaviorSubject<string>('');

	constructor(
		private readonly authService: AuthService,
		readonly fb: NonNullableFormBuilder,
		readonly router: Router
	) {
		if (this.authService.isLoggedIn$.value) {
			this.router.navigate(['/account']);
		}

		this.loginForm = this.fb.group({
			username: this.fb.control<string>('', Validators.required),
			password: this.fb.control<string>('', Validators.required),
		});

		this.loginForm.controls['username'].errors;
	}

	submitForm() {
		if (this.loginForm.valid) {
			this.authService.login(this.loginForm.value as AuthLogin).subscribe({
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
}
