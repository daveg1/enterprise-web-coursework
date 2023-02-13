import { Component } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { QuoteService } from 'src/app/services/quote.service';
import type { Budget } from 'src/app/types/Budget';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
})
export class HomeComponent {
	readonly budgetForm;

	timeUnits = ['hours', 'days', 'months'];
	payGrades = ['junior', 'standard', 'senior'];
	frequencies = ['weekly', 'monthly'];

	quote$ = new Subject<number>();
	isLoggedIn$;

	hasSaved = false;

	constructor(
		private readonly authService: AuthService,
		private readonly quoteService: QuoteService,
		readonly formBuilder: NonNullableFormBuilder
	) {
		this.isLoggedIn$ = this.authService.isLoggedIn$;

		this.budgetForm = this.formBuilder.group<Budget>({
			timeWorked: 0,
			timeUnit: this.timeUnits[0],
			payGrade: this.payGrades[0],
			oneOffCost: 0,
			ongoingCost: 0,
			ongoingFrequency: this.frequencies[0],
		});
	}

	submitForm() {
		if (this.budgetForm.valid) {
			this.quoteService
				.getQuote(this.budgetForm.value as Budget)
				.subscribe((res) => {
					this.quote$.next(res.quote);
				});
		} else {
			console.log('Form not valid', this.budgetForm.value);
		}
	}

	saveQuote() {
		this.hasSaved = !this.hasSaved;
	}
}
