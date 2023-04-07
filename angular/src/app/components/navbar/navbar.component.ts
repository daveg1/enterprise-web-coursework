import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
})
export class NavbarComponent {
	isLoggedIn$;
	isAdmin$;

	constructor(
		private readonly authService: AuthService,
		readonly router: Router
	) {
		this.isLoggedIn$ = this.authService.isLoggedIn$;
		this.isAdmin$ = this.authService.isAdmin$;
	}

	logout() {
		this.authService.logout();
		this.router.navigate(['/']);
	}
}
