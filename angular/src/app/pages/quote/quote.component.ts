import {
	AfterViewInit,
	Component,
	QueryList,
	ViewChild,
	ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { CalculatorFormComponent } from 'src/app/components/calculator-form/calculator-form.component';
import { AuthService } from 'src/app/services/auth.service';
import { QuoteService } from 'src/app/services/quote.service';
import { QuoteWholeResponse } from 'src/app/types/quote';

@Component({
	selector: 'app-quote',
	templateUrl: './quote.component.html',
})
export class QuoteComponent implements AfterViewInit {
	@ViewChildren(CalculatorFormComponent)
	calculatorForm!: QueryList<CalculatorFormComponent>;

	isLoggedIn$;
	quote$ = new BehaviorSubject<QuoteWholeResponse | null>(null);

	constructor(
		private readonly authService: AuthService,
		private readonly quoteService: QuoteService,
		readonly router: Router,
		readonly route: ActivatedRoute
	) {
		this.isLoggedIn$ = this.authService.isLoggedIn$;

		this.route.paramMap.subscribe((paramMap) => {
			const quoteId = paramMap.get('id') ?? '';

			// Redirect if no id
			// (not actually needed but keeps TS happy)
			if (!quoteId) {
				this.router.navigate(['/']);
			}

			this.quoteService.getQuoteById(quoteId).subscribe({
				next: (quote) => {
					this.quote$.next(quote);
				},

				error: () => {
					console.error('Failed to load quote:', quoteId);
				},
			});
		});
	}

	/**
	 * Currently causes state inconsistencies
	 * @todo use quoteSerice.currentQuote$
	 */
	ngAfterViewInit() {
		this.calculatorForm.changes.subscribe(() => {
			console.log('form', this.calculatorForm.first);

			if (this.quote$.value) {
				this.calculatorForm.first.setQuote(this.quote$.value);
			}
		});
	}

	onQuoteCalculated(quote: number) {
		console.log(quote);
	}
}
