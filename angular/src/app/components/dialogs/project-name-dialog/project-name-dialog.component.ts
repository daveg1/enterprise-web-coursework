import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

export interface ProjectNameDialogData {
	projectName: string;
}

@Component({
	selector: 'app-project-name-dialog',
	templateUrl: './project-name-dialog.component.html',
})
export class ProjectNameDialogComponent {
	readonly form;

	constructor(
		public dialogRef: DialogRef<string>,
		@Inject(DIALOG_DATA) data: ProjectNameDialogData,
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
