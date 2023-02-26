import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
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
		readonly fb: NonNullableFormBuilder,
		readonly dialog: DialogService
	) {
		this.saveQuoteForm = this.fb.group({
			projectName: this.fb.control('', [Validators.maxLength(64)]),
		});
	}

	submitForm() {
		if (this.saveQuoteForm.valid) {
			this.quoteService.setCurrentQuote(true);
			this.dialog.hide();
			this.saveQuoteForm.reset();
		} else {
			this.saveQuoteForm.markAllAsTouched();
		}
	}
}
