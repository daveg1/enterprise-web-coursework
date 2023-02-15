import { Component, ElementRef, Input } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
})
export class DialogComponent {
	@Input() header = '';

	constructor(readonly dialogService: DialogService) {}

	show() {
		this.dialogService.show();
	}

	hide() {
		this.dialogService.hide();
	}
}
