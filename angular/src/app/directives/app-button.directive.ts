import { Directive, ElementRef, Input } from '@angular/core';

const baseStyles = [
	'flex',
	'items-center',
	'h-8',
	'transition-colors',
	'rounded',
	'text-sm',
	'font-semibold',
	'disabled:opacity-50',
	'disabled:hover:bg-white',
];

type buttonTypes = 'primary' | 'secondary';

const typeStyles = {
	primary: [
		'text-slate-50',
		'bg-emerald-600',
		'hover:bg-emerald-600/75',
		'active:bg-emerald-700',
	],

	secondary: ['text-emerald-600', 'hover:bg-emerald-50/75'],
};

type buttonSizes = 'small' | 'normal';

const sizeStyles = {
	small: ['px-2'],

	normal: ['min-w-[6rem]', 'justify-center', 'px-4'],
};

@Directive({
	selector: '[appButton]',
})
export class ButtonDirective {
	private type_: buttonTypes = 'primary';
	private size_: buttonSizes = 'normal';

	@Input()
	set type(value: buttonTypes) {
		const elem = this.el.nativeElement as Element;

		elem.classList.remove(...typeStyles[this.type_]);

		this.type_ = value;
		elem.classList.add(...typeStyles[this.type_]);
	}

	get type() {
		return this.type_;
	}

	@Input()
	set size(value: buttonSizes) {
		const elem = this.el.nativeElement as Element;

		elem.classList.remove(...sizeStyles[this.size_]);

		this.size_ = value;
		elem.classList.add(...sizeStyles[this.size_]);
	}

	get size() {
		return this.size_;
	}

	constructor(private el: ElementRef) {
		const elem = this.el.nativeElement as Element;

		// Add base styles
		elem.classList.add(...baseStyles);
		elem.classList.add(...typeStyles[this.type_]);
		elem.classList.add(...sizeStyles[this.size_]);
	}
}
