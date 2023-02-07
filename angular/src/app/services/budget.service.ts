import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class BudgetService {
	private endpoint = 'http://localhost:3934/budget';

	private currencyFormat = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP',
	});

	constructor(private readonly http: HttpClient) {}

	getBudget() {
		return this.http.get(this.endpoint);
	}

	formatAsCurrency(value: number) {
		return this.currencyFormat.format(value);
	}
}
