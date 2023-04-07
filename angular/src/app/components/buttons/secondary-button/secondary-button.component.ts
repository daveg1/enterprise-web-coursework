import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-secondary-button',
	templateUrl: './secondary-button.component.html',
})
export class SecondaryButtonComponent {
	@Input() text = '';
	@Input() disabled = false;
}
