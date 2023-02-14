import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { QuoteService } from 'src/app/services/quote.service';
import type { Budget } from 'src/app/types/Budget';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

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
	hasSaved = false;

	constructor(
		private readonly authService: AuthService,
		private readonly quoteService: QuoteService,
		readonly fb: NonNullableFormBuilder
	) {
		this.isLoggedIn$ = this.authService.isLoggedIn$;

		this.budgetForm = this.fb.group({
			workers: this.fb.array([this.fb.group(this.workerForm)]),
			oneOffCosts: this.fb.array([this.fb.group(this.oneOffCostForm)]),
			ongoingCosts: this.fb.array([this.fb.group(this.ongoingCostForm)]),
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
			this.budgetForm.markAllAsTouched();
		}
	}

	saveQuote() {
		this.hasSaved = !this.hasSaved;
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
