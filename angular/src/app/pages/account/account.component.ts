import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.css'],
})
export class AccountComponent {
	constructor(
		private readonly authService: AuthService,
		readonly router: Router,
		readonly route: ActivatedRoute
	) {
		this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
			console.log(isLoggedIn);
			if (!isLoggedIn) {
				this.router.navigate(['/']);
			}
		});
	}
}
