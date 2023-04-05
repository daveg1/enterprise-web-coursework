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

	readonly budgetForm;
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
		this.budgetForm = this.fb.group({
			workers: this.fb.array([this.fb.group(workerForm)]),
			oneOffCosts: this.fb.array([this.fb.group(oneOffCostForm)]),
			ongoingCosts: this.fb.array([this.fb.group(ongoingCostForm)]),
		});

		// Remove one-off and ongoing cost rows (by default only have a worker row)
		this.budgetForm.controls['oneOffCosts'].removeAt(0);
		this.budgetForm.controls['ongoingCosts'].removeAt(0);
	}

	/**
	 * Allows an existing quote is to be loaded by this form.
	 * Generates rows based on the fields in the provided quote object.
	 */
	setQuote(quote: QuoteWholeResponse) {
		this.budgetForm.controls['workers'].removeAt(0);

		quote.budget.workers.forEach((worker) => {
			const row = this.fb.group(workerForm);
			row.controls['payGrade'].setValue(worker.payGrade);
			row.controls['timeUnit'].setValue(worker.timeUnit);
			row.controls['timeWorked'].setValue(worker.timeWorked);

			this.budgetForm.controls['workers'].push(row);
		});

		quote.budget.oneOffCosts.forEach((oneOffCost) => {
			const row = this.fb.group(oneOffCostForm);
			row.controls['cost'].setValue(oneOffCost.cost);
			row.controls['itemName'].setValue(oneOffCost.itemName);

			this.budgetForm.controls['oneOffCosts'].push(row);
		});

		quote.budget.ongoingCosts.forEach((ongoingCost) => {
			const row = this.fb.group(ongoingCostForm);
			row.controls['cost'].setValue(ongoingCost.cost);
			row.controls['itemName'].setValue(ongoingCost.itemName);

			this.budgetForm.controls['ongoingCosts'].push(row);
		});
	}

	submitForm() {
		if (this.budgetForm.valid) {
			this.quoteService
				.calculateQuote(this.budgetForm.value as Budget)
				.subscribe((res) => {
					this.quoteCalculated.emit(res.quote);
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
		const worker = this.fb.group(workerForm);
		this.budgetForm.controls['workers'].push(worker);
	}

	removeWorker(index: number) {
		this.budgetForm.controls['workers'].removeAt(index);
	}

	addOneOffCost() {
		const oneOffCost = this.fb.group(oneOffCostForm);
		this.budgetForm.controls['oneOffCosts'].push(oneOffCost);
	}

	removeOneOffCost(index: number) {
		this.budgetForm.controls['oneOffCosts'].removeAt(index);
	}

	addOngoingCost() {
		const ongoingCost = this.fb.group(ongoingCostForm);

		this.budgetForm.controls['ongoingCosts'].push(ongoingCost);
	}

	removeOngoingCost(index: number) {
		this.budgetForm.controls['ongoingCosts'].removeAt(index);
	}
}
