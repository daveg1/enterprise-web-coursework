import { Component } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import type { User } from 'src/app/types/User';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
	signupForm;

	constructor(
		readonly formBuilder: NonNullableFormBuilder,
		private readonly accountService: AccountService
	) {
		this.signupForm = this.formBuilder.group<User>({
			firstname: '',
			lastname: '',
			username: '',
			password: '',
		});
	}

	submitForm() {
		if (this.signupForm.valid) {
			this.accountService
				.createUser(this.signupForm.value as User)
				.subscribe(console.log);
		} else {
			console.log('Form is not valid', this.signupForm.value);
		}
	}
}
