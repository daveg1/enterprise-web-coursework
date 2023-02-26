import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
})
export class AccountComponent {
	user$;

	constructor(
		private readonly authService: AuthService,
		readonly router: Router,
		readonly route: ActivatedRoute
	) {
		if (this.authService.isLoggedIn$.value) {
			this.router.navigate(['/']);
		}

		this.user$ = this.authService.userState$;
	}
}
