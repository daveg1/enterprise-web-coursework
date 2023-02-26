import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { BudgetService } from 'src/app/services/budget.service';
import { DialogService } from 'src/app/services/dialog.service';
import { QuoteService } from 'src/app/services/quote.service';

@Component({
	selector: 'app-save-quote-dialog',
	templateUrl: './save-quote-dialog.component.html',
})
export class SaveQuoteDialogComponent {
	readonly saveQuoteForm;

	constructor(
		private readonly quoteService: QuoteService,
		private readonly budgetService: BudgetService,
		readonly fb: NonNullableFormBuilder,
		readonly dialog: DialogService
	) {
		this.saveQuoteForm = this.fb.group({
			projectName: this.fb.control('', [Validators.maxLength(64)]),
		});
	}

	submitForm() {
		if (this.saveQuoteForm.valid) {
			if (
				this.budgetService.currentBudget &&
				this.saveQuoteForm.value.projectName
			) {
				this.quoteService
					.saveQuote(
						this.budgetService.currentBudget,
						this.saveQuoteForm.value.projectName
					)
					.subscribe({
						next: () => {
							this.quoteService.setCurrentQuote(true);
							this.dialog.hide();
							this.saveQuoteForm.reset();
						},

						error: (err) => {
							console.error('There was an error saving the quote', err);
						},
					});
			} else {
				console.log(
					'Save quote form: either budget or project name is not set.'
				);
			}
		} else {
			this.saveQuoteForm.markAllAsTouched();
		}
	}
}
