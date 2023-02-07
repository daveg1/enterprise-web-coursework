import { Component } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import type { User } from 'src/app/types/User';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
	signupForm;

	constructor(readonly formBuilder: NonNullableFormBuilder) {
		this.signupForm = this.formBuilder.group<User>({
			firstname: '',
			lastname: '',
			username: '',
			password: '',
		});
	}

	submitForm() {
		if (this.signupForm.valid) {
			console.log(this.signupForm.value);
		} else {
			console.log('Form is not valid', this.signupForm.value);
		}
	}
}
