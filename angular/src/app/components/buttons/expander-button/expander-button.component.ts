import { Component } from '@angular/core';

@Component({
	selector: 'app-expander-button',
	templateUrl: './expander-button.component.html',
})
export class ExpanderButtonComponent {
	protected active_ = false;

	set active(value: boolean) {
		this.active_ = value;
	}

	get active() {
		return this.active_;
	}

	toggle(): boolean {
		this.active_ = !this.active_;
		return this.active_;
	}
}
