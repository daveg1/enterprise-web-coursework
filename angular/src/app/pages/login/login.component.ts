import { Component } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AuthLogin } from 'src/app/types/auth';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent {
	loginForm;
	response$ = new BehaviorSubject<string>('');

	constructor(
		readonly formBuilder: NonNullableFormBuilder,
		private readonly authService: AuthService,
		readonly router: Router
	) {
		this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
			if (isLoggedIn) {
				this.router.navigate(['']);
			}
		});

		this.loginForm = this.formBuilder.group<AuthLogin>({
			username: '',
			password: '',
		});
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
			console.log('Form is not valid', this.loginForm.value);
		}
	}
}
