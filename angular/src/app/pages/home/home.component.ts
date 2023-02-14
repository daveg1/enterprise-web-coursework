import { Component } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { QuoteService } from 'src/app/services/quote.service';
import type { Budget } from 'src/app/types/Budget';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
})
export class HomeComponent {
	timeUnits = ['hours', 'days', 'months'];
	payGrades = ['junior', 'standard', 'senior'];
	frequencies = ['weekly', 'monthly'];

	readonly budgetForm;

	private readonly workerForm = {
		timeWorked: 0,
		timeUnit: this.timeUnits[0],
		payGrade: this.payGrades[0],
	};

	quote$ = new Subject<number>();
	isLoggedIn$;

	hasSaved = false;

	constructor(
		private readonly authService: AuthService,
		private readonly quoteService: QuoteService,
		readonly fb: NonNullableFormBuilder
	) {
		this.isLoggedIn$ = this.authService.isLoggedIn$;

		this.budgetForm = this.fb.group({
			workers: this.fb.array([this.fb.group(this.workerForm)]),
			oneOffCost: 0,
			ongoingCost: 0,
			ongoingFrequency: this.frequencies[0],
		});
	}

	submitForm() {
		if (this.budgetForm.valid) {
			this.quoteService
				.getQuote(this.budgetForm.value as Budget)
				.subscribe((res) => {
					this.quote$.next(res.quote);
				});
		} else {
			this.budgetForm.markAllAsTouched();
		}
	}

	saveQuote() {
		this.hasSaved = !this.hasSaved;
	}

	addWorker() {
		const worker = this.fb.group(this.workerForm);
		this.budgetForm.controls['workers'].push(worker);
	}

	removeWorker(index: number) {
		this.budgetForm.controls['workers'].removeAt(index);
	}
}
