import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { QuoteService } from 'src/app/services/quote.service';
import type { Budget } from 'src/app/types/Budget';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { BudgetService } from 'src/app/services/budget.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
})
export class HomeComponent {
	readonly timeUnits = ['hours', 'days', 'months'];
	readonly payGrades = ['junior', 'standard', 'senior'];
	readonly frequencies = ['weekly', 'monthly'];

	// Forms
	readonly budgetForm;

	private readonly workerForm = {
		timeWorked: 0,
		timeUnit: this.timeUnits[0],
		payGrade: this.payGrades[0],
	};

	private readonly oneOffCostForm = {
		itemName: ['', Validators.maxLength(64)],
		cost: 0,
	};

	private readonly ongoingCostForm = {
		itemName: '',
		cost: 0,
		amount: 0,
		frequency: this.frequencies[0],
	};

	// States
	quote$ = new Subject<number>();
	isLoggedIn$;
	currentQuote$;

	constructor(
		private readonly authService: AuthService,
		private readonly budgetService: BudgetService,
		private readonly quoteService: QuoteService,
		readonly fb: NonNullableFormBuilder,
		readonly dialog: DialogService
	) {
		this.isLoggedIn$ = this.authService.isLoggedIn$;
		this.currentQuote$ = this.quoteService.currentQuote$;

		this.budgetForm = this.fb.group({
			workers: this.fb.array([this.fb.group(this.workerForm)]),
			oneOffCosts: this.fb.array([this.fb.group(this.oneOffCostForm)]),
			ongoingCosts: this.fb.array([this.fb.group(this.ongoingCostForm)]),
		});
	}

	submitForm() {
		if (this.budgetForm.valid) {
			this.quoteService
				.calculateQuote(this.budgetForm.value as Budget)
				.subscribe((res) => {
					this.quote$.next(res.quote);
				});
		} else {
			this.budgetForm.markAllAsTouched();
		}
	}

	saveQuote() {
		this.budgetService.currentBudget = this.budgetForm.value as Budget;
		this.dialog.show();
	}

	addWorker() {
		const worker = this.fb.group(this.workerForm);
		this.budgetForm.controls['workers'].push(worker);
	}

	removeWorker(index: number) {
		this.budgetForm.controls['workers'].removeAt(index);
	}

	addOneOffCost() {
		const oneOffCost = this.fb.group(this.oneOffCostForm);
		this.budgetForm.controls['oneOffCosts'].push(oneOffCost);
	}

	removeOneOffCost(index: number) {
		this.budgetForm.controls['oneOffCosts'].removeAt(index);
	}

	addOngoingCost() {
		const ongoingCost = this.fb.group(this.ongoingCostForm);
		this.budgetForm.controls['ongoingCosts'].push(ongoingCost);
	}

	removeOngoingCost(index: number) {
		this.budgetForm.controls['ongoingCosts'].removeAt(index);
	}
}
