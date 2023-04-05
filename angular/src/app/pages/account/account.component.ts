import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { QuoteService } from 'src/app/services/quote.service';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
})
export class AccountComponent {
	user$;
	quotes$;

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
		this.quotes$ = this.quoteService.quotes$;

		this.user$ = this.authService.userState$;
		this.quoteService.getQuotesForUser(state.token).subscribe({
			error: (err) => {
				console.error(err);
			},
		});
	}

	// Quotes

	deleteQuote(quoteId: string) {
		this.quoteService.deleteQuote(quoteId).subscribe({
			next: () => {
				console.log('quote deleted');
				const index = this.quotes$.value.findIndex((q) => q._id === quoteId);
				this.quotes$.value.splice(index, 1);
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
