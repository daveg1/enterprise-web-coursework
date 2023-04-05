import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { QuoteService } from 'src/app/services/quote.service';
import { QuotesResponse } from 'src/app/types/quote';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
})
export class AccountComponent {
	user$;
	quotes$ = new Subject<QuotesResponse>();

	constructor(
		private readonly authService: AuthService,
		private readonly quoteService: QuoteService,
		readonly router: Router,
		readonly route: ActivatedRoute
	) {
		if (!this.authService.isLoggedIn$.value) {
			this.router.navigate(['/']);
		}

		const state = this.authService.userState$.value!;

		this.user$ = this.authService.userState$;
		this.quoteService.getQuotesForUser(state.token).subscribe((quotes) => {
			this.quotes$.next(quotes);
		});
	}

	// Quotes

	deleteQuote(quoteId: string) {
		this.quoteService.deleteQuote(quoteId).subscribe({
			next: () => {
				console.log('quote deleted');
				// todo remove row
				// store current quotes in quote service
				// quotes.findIndex(quoteId) and remove it
			},

			error: (err) => {
				console.error(err);
			},
		});
	}

	// Account

	deleteAccount() {
		if (this.user$.value) {
			const { token } = this.user$.value;

			this.authService.delete(token).subscribe({
				next: () => {
					// Redirect to home page
					this.router.navigate(['/']);
				},
				error: (err) => {},
			});
		}
	}
}
