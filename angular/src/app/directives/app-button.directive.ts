import { Directive, ElementRef, Input } from '@angular/core';

const baseStyles = [
	'cursor-pointer',
	'flex',
	'items-center',
	'h-8',
	'transition-colors',
	'rounded',
	'text-sm',
	'font-semibold',
];

type buttonVariants = 'primary' | 'secondary';

const variantStyles = {
	primary: [
		'text-slate-50',
		'bg-emerald-600',
		'hover:bg-emerald-600/75',
		'active:bg-emerald-700',
		'disabled:opacity-50',
	],

	secondary: [
		'text-emerald-600',
		'hover:bg-emerald-50/75',
		'disabled:opacity-50',
		'disabled:hover:bg-white',
	],
};

type buttonSizes = 'small' | 'normal';

const sizeStyles = {
	small: ['px-2'],

	normal: ['min-w-[6rem]', 'justify-center', 'px-4'],
};

type buttonOutlined = 'outlined' | 'none';

const outlinedStyles = {
	outlined: ['border', 'border-emerald-600'],
	none: [],
};

@Directive({
	selector: '[appButton]',
})
export class ButtonDirective {
	private variant_: buttonVariants = 'primary';
	private size_: buttonSizes = 'normal';
	private outlined_: buttonOutlined = 'none';

	@Input()
	set variant(value: buttonVariants) {
		const elem = this.el.nativeElement as Element;

		elem.classList.remove(...variantStyles[this.variant_]);

		this.variant_ = value;
		elem.classList.add(...variantStyles[this.variant_]);
	}

	get variant() {
		return this.variant_;
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

	@Input()
	set outlined(value: buttonOutlined) {
		const elem = this.el.nativeElement as Element;

		elem.classList.remove(...outlinedStyles[this.outlined_]);

		this.outlined_ = value;
		elem.classList.add(...outlinedStyles[this.outlined_]);
	}

	get outlined() {
		return this.outlined_;
	}

	constructor(private el: ElementRef) {
		const elem = this.el.nativeElement as Element;

		// Add base styles
		elem.classList.add(...baseStyles);
		elem.classList.add(...variantStyles[this.variant_]);
		elem.classList.add(...sizeStyles[this.size_]);
		elem.classList.add(...outlinedStyles[this.outlined_]);
	}
}
