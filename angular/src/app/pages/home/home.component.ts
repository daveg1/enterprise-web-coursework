import { Component } from '@angular/core';
import { QuoteService } from 'src/app/services/quote.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
})
export class HomeComponent {
	// States
	isLoggedIn$;
	currentQuote$;
	quote$ = new Subject<number>();

	constructor(
		private readonly authService: AuthService,
		private readonly quoteService: QuoteService
	) {
		this.isLoggedIn$ = this.authService.isLoggedIn$;
		this.currentQuote$ = this.quoteService.currentQuote$;
	}

	onQuoteCalculated(quote: number) {
		this.quote$.next(quote);
	}
}
