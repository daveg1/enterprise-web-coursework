import { Dialog } from '@angular/cdk/dialog';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProjectNameDialogComponent } from 'src/app/components/dialogs/project-name-dialog/project-name-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { QuoteService } from 'src/app/services/quote.service';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
})
export class AccountComponent implements OnDestroy {
	user$;
	quotes$;
	isMerging = false;
	selectedQuotes: string[] = [];

	private readonly unsubscribe$ = new Subject<void>();

	constructor(
		private readonly authService: AuthService,
		private readonly quoteService: QuoteService,
		readonly router: Router,
		readonly route: ActivatedRoute,
		readonly dialog: Dialog
	) {
		if (!this.authService.isLoggedIn$.value) {
			this.router.navigate(['/']);
		}

		this.quotes$ = this.quoteService.quotes$;
		this.user$ = this.authService.userState$;

		// Pulls latest list of quotes
		this.getQuotes();
	}

	// Quotes

	getQuotes() {
		this.quoteService
			.getQuotes()
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe({
				error: (err) => {
					console.error(err);
				},
			});
	}

	deleteQuote(quoteId: string) {
		this.quoteService
			.deleteQuote(quoteId)
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe({
				next: () => {
					// Update quotes list
					this.getQuotes();
				},

				error: (err) => {
					console.error(err);
				},
			});
	}

	toggleMergeView() {
		this.selectedQuotes = []; // reset on toggle
		this.isMerging = !this.isMerging;
	}

	selectQuote(quoteId: string) {
		// Ignore if not merging
		if (!this.isMerging) {
			return;
		}

		const index = this.selectedQuotes.findIndex((val) => val === quoteId);

		// If exists, remove it
		if (index !== -1) {
			this.selectedQuotes.splice(index, 1);
		} else {
			this.selectedQuotes.push(quoteId);
		}
	}

	mergeQuotes() {
		const dialogRef = this.dialog.open<string>(ProjectNameDialogComponent, {
			width: '20rem',
		});

		dialogRef.closed.subscribe({
			next: (projectName) => {
				if (!projectName) {
					return;
				}

				this.quoteService
					.mergeQuotes(this.selectedQuotes, projectName)
					.pipe(takeUntil(this.unsubscribe$))
					.subscribe({
						next: () => {
							// Update quotes list
							this.getQuotes();
							this.toggleMergeView();
						},
					});
			},
		});
	}

	// Account

	deleteAccount() {
		if (this.user$.value) {
			const { token } = this.user$.value;

			this.authService
				.delete(token)
				.pipe(takeUntil(this.unsubscribe$))
				.subscribe({
					next: () => {
						// Redirect to home page
						this.router.navigate(['/']);
					},
					error: (err) => {},
				});
		}
	}

	// Lifecycle

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
