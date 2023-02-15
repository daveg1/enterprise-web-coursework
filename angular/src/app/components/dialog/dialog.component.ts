import { Component, ElementRef, Input } from '@angular/core';

@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
})
export class DialogComponent {
	@Input() header = '';
	private element: HTMLElement;

	constructor(private readonly el: ElementRef) {
		this.element = this.el.nativeElement;
		this.hide();
	}

	show() {
		this.element.removeAttribute('hidden');
	}

	hide() {
		this.element.setAttribute('hidden', '');
	}
}
