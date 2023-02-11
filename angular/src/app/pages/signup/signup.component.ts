import { Component } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import type { AuthSignUp } from 'src/app/types/auth';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
	signupForm;

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
			this.authService
				.signup(this.signupForm.value as AuthSignUp)
				.subscribe(console.log);
		} else {
			console.log('Form is not valid', this.signupForm.value);
		}
	}
}
