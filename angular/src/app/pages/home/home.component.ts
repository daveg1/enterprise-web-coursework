import { Component } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { BudgetService } from 'src/app/services/budget.service';
import type { Budget } from 'src/app/types/Budget';
import { Subject } from 'rxjs';

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

	constructor(
		private readonly budgetService: BudgetService,
		readonly formBuilder: NonNullableFormBuilder
	) {
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
			this.budgetService
				.getQuote(this.budgetForm.value as Budget)
				.subscribe((res) => {
					this.quote$.next(res.quote);
				});
		} else {
			console.log('Form not valid', this.budgetForm.value);
		}
	}
}
