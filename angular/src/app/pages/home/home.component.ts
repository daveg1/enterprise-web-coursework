import { Component } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { BudgetService } from 'src/app/services/budget.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
})
export class HomeComponent {
	private form;

	constructor(
		private readonly budgetService: BudgetService,
		readonly formBuilder: NonNullableFormBuilder
	) {
		this.form = this.formBuilder.group({});

		this.budgetService.getBudget().subscribe(console.log);
	}
}
