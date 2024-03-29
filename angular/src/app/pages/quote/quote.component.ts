import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CalculatorFormComponent } from 'src/app/components/calculator-form/calculator-form.component';
import { AuthService } from 'src/app/services/auth.service';
import { QuoteService } from 'src/app/services/quote.service';

@Component({
	selector: 'app-quote',
	templateUrl: './quote.component.html',
})
export class QuoteComponent implements OnDestroy {
	@ViewChild(CalculatorFormComponent)
	calculatorForm!: CalculatorFormComponent;

	baseValue?: typeof this.calculatorForm.subtasks.value;

	isLoggedIn$;
	quote$;

	private readonly unsubscribe$ = new Subject<void>();

	constructor(
		private readonly authService: AuthService,
		private readonly quoteService: QuoteService,
		readonly router: Router,
		readonly route: ActivatedRoute
	) {
		this.isLoggedIn$ = this.authService.isLoggedIn$;
		this.quote$ = this.quoteService.currentQuote$;

		this.route.paramMap.subscribe((paramMap) => {
			const quoteId = paramMap.get('id') ?? '';

			// Redirect if no id
			// (not actually needed but keeps TS happy)
			if (!quoteId) {
				this.router.navigate(['/']);
			}

			this.quoteService
				.getQuoteById(quoteId)
				.pipe(takeUntil(this.unsubscribe$))
				.subscribe({
					next: (quote) => {
						this.calculatorForm.setQuote(quote);
						this.baseValue = this.calculatorForm.subtasks.value;
					},

					error: () => {
						console.error('Failed to load quote:', quoteId);
					},
				});
		});
	}

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
