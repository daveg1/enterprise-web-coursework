import { Component, EventEmitter, Output } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { QuoteService } from 'src/app/services/quote.service';
import type { Budget } from 'src/app/types/budget';
import { BudgetService } from 'src/app/services/budget.service';
import { DialogService } from 'src/app/services/dialog.service';
import {
	frequencies,
	oneOffCostForm,
	ongoingCostForm,
	payGrades,
	timeUnits,
	workerForm,
} from './calculator-form-fields';
import { QuoteWholeResponse } from 'src/app/types/quote';

@Component({
	selector: 'app-calculator-form',
	templateUrl: './calculator-form.component.html',
})
export class CalculatorFormComponent {
	@Output() quoteCalculated = new EventEmitter<number>();

	readonly form;
	// the following are used in the template
	readonly timeUnits = timeUnits;
	readonly payGrades = payGrades;
	readonly frequencies = frequencies;

	constructor(
		private readonly budgetService: BudgetService,
		private readonly quoteService: QuoteService,
		readonly fb: NonNullableFormBuilder,
		readonly dialog: DialogService
	) {
		this.form = this.fb.group({
			workers: this.fb.array([this.fb.group(workerForm)]),
			oneOffCosts: this.fb.array([this.fb.group(oneOffCostForm)]),
			ongoingCosts: this.fb.array([this.fb.group(ongoingCostForm)]),
		});

		// Remove one-off and ongoing cost rows (by default only have a worker row)
		this.form.controls['oneOffCosts'].removeAt(0);
		this.form.controls['ongoingCosts'].removeAt(0);
	}

	/**
	 * Allows an existing quote is to be loaded by this form.
	 * Generates rows based on the fields in the provided quote object.
	 */
	setQuote(quote: QuoteWholeResponse) {
		this.form.controls['workers'].removeAt(0);

		quote.budget.workers.forEach((worker) => {
			const row = this.fb.group(workerForm);
			row.controls['payGrade'].setValue(worker.payGrade);
			row.controls['timeUnit'].setValue(worker.timeUnit);
			row.controls['timeWorked'].setValue(worker.timeWorked);

			this.form.controls['workers'].push(row);
		});

		quote.budget.oneOffCosts.forEach((oneOffCost) => {
			const row = this.fb.group(oneOffCostForm);
			row.controls['cost'].setValue(oneOffCost.cost);
			row.controls['itemName'].setValue(oneOffCost.itemName);

			this.form.controls['oneOffCosts'].push(row);
		});

		quote.budget.ongoingCosts.forEach((ongoingCost) => {
			const row = this.fb.group(ongoingCostForm);
			row.controls['cost'].setValue(ongoingCost.cost);
			row.controls['itemName'].setValue(ongoingCost.itemName);

			this.form.controls['ongoingCosts'].push(row);
		});
	}

	submitForm() {
		if (this.form.valid) {
			this.quoteService
				.calculateQuote(this.form.value as Budget)
				.subscribe((res) => {
					this.quoteCalculated.emit(res.quote);
				});
		} else {
			this.form.markAllAsTouched();
		}
	}

	saveQuote() {
		this.budgetService.currentBudget = this.form.value as Budget;
		this.dialog.show();
	}

	addWorker() {
		const worker = this.fb.group(workerForm);
		this.form.controls['workers'].push(worker);
	}

	removeWorker(index: number) {
		this.form.controls['workers'].removeAt(index);
	}

	addOneOffCost() {
		const oneOffCost = this.fb.group(oneOffCostForm);
		this.form.controls['oneOffCosts'].push(oneOffCost);
	}

	removeOneOffCost(index: number) {
		this.form.controls['oneOffCosts'].removeAt(index);
	}

	addOngoingCost() {
		const ongoingCost = this.fb.group(ongoingCostForm);

		this.form.controls['ongoingCosts'].push(ongoingCost);
	}

	removeOngoingCost(index: number) {
		this.form.controls['ongoingCosts'].removeAt(index);
	}
}
