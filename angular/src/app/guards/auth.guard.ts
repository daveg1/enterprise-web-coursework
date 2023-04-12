import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(
		private readonly authService: AuthService,
		readonly router: Router
	) {}

	canActivate() {
		if (!this.authService.userState$.value) {
			this.router.navigate(['/login']);
			return false;
		}

		return true;
	}
}
