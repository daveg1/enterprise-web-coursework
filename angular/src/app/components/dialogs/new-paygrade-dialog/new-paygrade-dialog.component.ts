import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { PaygradeDialogForm } from 'src/app/types/paygrade';

@Component({
	selector: 'app-new-paygrade-dialog',
	templateUrl: './new-paygrade-dialog.component.html',
})
export class NewPaygradeDialogComponent {
	readonly form;

	constructor(
		public dialogRef: DialogRef<PaygradeDialogForm>,
		readonly fb: NonNullableFormBuilder
	) {
		this.form = fb.group({
			role: ['', Validators.maxLength(64)],
			hourlyRate: [10, Validators.min(1)],
		});
	}

	submit() {
		if (this.form.valid) {
			this.dialogRef.close(this.form.value as PaygradeDialogForm);
		} else {
			this.form.markAllAsTouched();
		}
	}
}
