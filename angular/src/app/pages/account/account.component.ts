import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
})
export class AccountComponent {
	isLoggedIn$;
	user$;

	constructor(
		private readonly authService: AuthService,
		readonly router: Router,
		readonly route: ActivatedRoute
	) {
		this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
			// Redirect if no session
			if (!isLoggedIn) {
				this.router.navigate(['/']);
			}
		});

		this.isLoggedIn$ = this.authService.isLoggedIn$;
		this.user$ = this.authService.userState$;
	}
}
