import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
	isLoggedIn$;

	constructor(
		private readonly authService: AuthService,
		readonly router: Router
	) {
		this.isLoggedIn$ = this.authService.isLoggedIn$;
	}

	logout() {
		this.authService.logout();
		this.router.navigate(['/']);
	}
}
