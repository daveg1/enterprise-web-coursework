import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-project-name-dialog',
	templateUrl: './project-name-dialog.component.html',
})
export class ProjectNameDialogComponent {
	readonly form;

	constructor(
		public dialogRef: DialogRef<string>,
		readonly fb: NonNullableFormBuilder
	) {
		this.form = fb.group({
			projectName: ['', Validators.maxLength(64)],
		});
	}

	submit() {
		if (this.form.valid) {
			this.dialogRef.close(this.form.value.projectName);
		}
	}
}
