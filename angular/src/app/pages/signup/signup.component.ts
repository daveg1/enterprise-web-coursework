import { Component } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import type { AuthSignUp } from 'src/app/types/auth';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
	signupForm;
	response$ = new BehaviorSubject<string>('');

	constructor(
		readonly formBuilder: NonNullableFormBuilder,
		private readonly authService: AuthService
	) {
		this.signupForm = this.formBuilder.group<AuthSignUp>({
			firstname: '',
			lastname: '',
			username: '',
			password: '',
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
			console.log('Form is not valid', this.signupForm.value);
		}
	}
}
