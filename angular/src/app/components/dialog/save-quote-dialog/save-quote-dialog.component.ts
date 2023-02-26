import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
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
		private readonly authService: AuthService,
		private readonly budgetService: BudgetService,
		private readonly quoteService: QuoteService,
		readonly fb: NonNullableFormBuilder,
		readonly dialog: DialogService
	) {
		this.saveQuoteForm = this.fb.group({
			projectName: this.fb.control('', [Validators.maxLength(64)]),
		});
	}

	async submitForm() {
		if (this.saveQuoteForm.valid) {
			// Get user state
			const state = this.authService.userState$.value;

			// Ensure budget and project name are set
			if (
				this.budgetService.currentBudget &&
				this.saveQuoteForm.value.projectName &&
				state
			) {
				this.quoteService
					.saveQuote(
						this.budgetService.currentBudget,
						this.saveQuoteForm.value.projectName,
						state.token
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
