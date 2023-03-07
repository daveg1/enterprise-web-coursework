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

		this.user$ = this.authService.userState$;
		this.quotes$ = this.quoteService.getQuotesForUser(state.token);
	}

	deleteAccount() {
		if (this.user$.value) {
			const { token } = this.user$.value;

			this.authService.delete(token).subscribe({
				next: (res) => {},
				error: (err) => {},
			});
		}
	}
}
