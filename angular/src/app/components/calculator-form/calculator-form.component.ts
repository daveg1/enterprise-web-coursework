import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormArray, NonNullableFormBuilder, Validators } from '@angular/forms';
import { QuoteService } from 'src/app/services/quote.service';
import type { Budget } from 'src/app/types/budget';
import { QuoteResponse } from 'src/app/types/quote';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { ProjectNameDialogComponent } from '../dialogs/project-name-dialog/project-name-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PaygradeService } from 'src/app/services/paygrade.service';
import { Paygrade } from 'src/app/types/paygrade';

const timeUnits = ['hours', 'days', 'months'];
const frequencies = ['weekly', 'monthly'];

const workerForm = {
	timeWorked: 0,
	timeUnit: timeUnits[0],
	payGrade: '',
};

const oneOffCostForm = {
	itemName: ['', Validators.maxLength(64)],
	cost: 0,
};

const ongoingCostForm = {
	itemName: '',
	cost: 0,
	amount: 0,
	frequency: frequencies[0],
};

@Component({
	selector: 'app-calculator-form',
	templateUrl: './calculator-form.component.html',
})
export class CalculatorFormComponent implements OnDestroy {
	@Output() quoteCalculated = new EventEmitter<number>();

	readonly subtasks;
	// the following are used in the template
	readonly timeUnits = timeUnits;
	readonly roles$ = new BehaviorSubject<Paygrade['role'][]>([]);
	readonly frequencies = frequencies;

	readonly quote$;
	readonly editing$;
	readonly currentEstimate$;
	readonly isAdmin$;

	useFudge = true;

	private readonly unsubscribe$ = new Subject<void>();

	constructor(
		private readonly authService: AuthService,
		private readonly paygradeService: PaygradeService,
		private readonly quoteService: QuoteService,
		readonly fb: NonNullableFormBuilder,
		readonly dialog: Dialog,
		readonly router: Router
	) {
		this.quote$ = this.quoteService.currentQuote$;
		this.editing$ = this.quoteService.editing$;
		this.currentEstimate$ = this.quoteService.currentEstimate$;
		this.isAdmin$ = this.authService.isAdmin$;

		// Paygrades
		this.paygradeService
			.getRoles()
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe({
				next: (roles) => {
					this.roles$.next(roles);
					workerForm.payGrade = roles[0];
				},
			});

		// Infer the types
		this.subtasks = this.fb.array([
			this.fb.group({
				workers: this.fb.array([this.fb.group(workerForm)]),
				oneOffCosts: this.fb.array([this.fb.group(oneOffCostForm)]),
				ongoingCosts: this.fb.array([this.fb.group(ongoingCostForm)]),
			}),
		]);

		// Remove one-off and ongoing cost rows (by default only have a worker row)
		this.subtasks.controls[0].controls['oneOffCosts'].clear();
		this.subtasks.controls[0].controls['ongoingCosts'].clear();
	}

	/**
	 * Allows an existing quote is to be loaded by this form.
	 * Generates rows based on the fields in the provided quote object.
	 */
	setQuote(quote: QuoteResponse) {
		this.subtasks.clear();

		quote.budgets.forEach((budget) => {
			const subtask = this.fb.group({
				workers: this.fb.array([this.fb.group(workerForm)]),
				oneOffCosts: this.fb.array([this.fb.group(oneOffCostForm)]),
				ongoingCosts: this.fb.array([this.fb.group(ongoingCostForm)]),
			});

			subtask.controls['workers'].clear();
			subtask.controls['oneOffCosts'].clear();
			subtask.controls['ongoingCosts'].clear();

			budget.workers.forEach((worker) => {
				const row = this.fb.group(workerForm);
				row.controls['payGrade'].setValue(worker.payGrade);
				row.controls['timeUnit'].setValue(worker.timeUnit);
				row.controls['timeWorked'].setValue(worker.timeWorked);

				subtask.controls['workers'].push(row);
			});

			budget.oneOffCosts.forEach((oneOffCost) => {
				const row = this.fb.group(oneOffCostForm);
				row.controls['cost'].setValue(oneOffCost.cost);
				row.controls['itemName'].setValue(oneOffCost.itemName);

				subtask.controls['oneOffCosts'].push(row);
			});

			budget.ongoingCosts.forEach((ongoingCost) => {
				const row = this.fb.group(ongoingCostForm);
				row.controls['cost'].setValue(ongoingCost.cost);
				row.controls['itemName'].setValue(ongoingCost.itemName);

				subtask.controls['ongoingCosts'].push(row);
			});

			this.subtasks.controls.push(subtask);
		});

		this.editing$.next(quote._id);
	}

	validateSubtasks() {
		for (const subtask of this.subtasks.controls) {
			if (!subtask.valid) {
				return false;
			}
		}

		return true;
	}

	calculateSubtask(subtask: (typeof this.subtasks.controls)[0]) {
		if (subtask && subtask.valid) {
			this.quoteService
				.calculateQuote(subtask.value as Budget, this.useFudge)
				.pipe(takeUntil(this.unsubscribe$))
				.subscribe((res) => {
					this.quoteCalculated.emit(res.estimate);
					this.quoteService.currentEstimate$.next(res.estimate);
				});
		} else {
			subtask.markAllAsTouched();
		}
	}

	calculateAllSubtasks() {
		const subtasks = this.subtasks.controls.map(
			(subtask) => subtask.value as Budget
		);

		if (!this.validateSubtasks()) {
			this.subtasks.markAllAsTouched();
			return;
		}

		this.quoteService
			.calculateQuoteBulk(subtasks, this.useFudge)
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe((res) => {
				this.quoteCalculated.emit(res.estimate);
				this.quoteService.currentEstimate$.next(res.estimate);
			});
	}

	saveQuote() {
		const budgets = this.subtasks.controls.map((form) => form.value as Budget);

		// If editing an existing quote, perform an update

		if (this.editing$.value) {
			if (!this.validateSubtasks()) {
				this.subtasks.markAllAsTouched();
				return;
			}

			const quoteId = this.editing$.value;

			this.quoteService
				.updateQuote(quoteId, budgets, this.useFudge)
				.pipe(takeUntil(this.unsubscribe$))
				.subscribe({
					next: (res) => {
						this.quoteCalculated.emit(res.estimate);
						this.quoteService.currentEstimate$.next(res.estimate);
					},

					error: (err) => {
						console.error(err);
					},
				});
		}

		// Otherwise, save a new one
		else {
			const dialogRef = this.dialog.open<string>(ProjectNameDialogComponent, {
				width: '20rem',
			});

			dialogRef.closed.pipe(takeUntil(this.unsubscribe$)).subscribe({
				next: (projectName) => {
					if (!projectName) {
						return;
					}

					this.quoteService
						.saveQuote(budgets, projectName, this.useFudge)
						.pipe(takeUntil(this.unsubscribe$))
						.subscribe({
							next: (quote) => {
								// navigate to the /quote version
								this.router.navigate(['/quote', quote._id]);
							},
							error: (err) => {
								console.error('There was an error saving the quote', err);
							},
						});
				},
			});
		}
	}

	addSubtask() {
		const subtask = this.fb.group({
			workers: this.fb.array([this.fb.group(workerForm)]),
			oneOffCosts: this.fb.array([this.fb.group(oneOffCostForm)]),
			ongoingCosts: this.fb.array([this.fb.group(ongoingCostForm)]),
		});

		// Remove one-off and ongoing cost rows (by default only have a worker row)
		subtask.controls['oneOffCosts'].clear();
		subtask.controls['ongoingCosts'].clear();

		this.subtasks.controls.push(subtask);
	}

	removeSubtask(subtaskIndex: number) {
		this.subtasks.removeAt(subtaskIndex);
	}

	addWorker(subtask: (typeof this.subtasks.controls)[0]) {
		const worker = this.fb.group(workerForm);
		subtask.controls['workers'].push(worker);
	}

	removeWorker(subtask: (typeof this.subtasks.controls)[0], index: number) {
		subtask.controls['workers'].removeAt(index);
	}

	addOneOffCost(subtask: (typeof this.subtasks.controls)[0]) {
		const oneOffCost = this.fb.group(oneOffCostForm);
		subtask.controls['oneOffCosts'].push(oneOffCost);
	}

	removeOneOffCost(subtask: (typeof this.subtasks.controls)[0], index: number) {
		subtask.controls['oneOffCosts'].removeAt(index);
	}

	addOngoingCost(subtask: (typeof this.subtasks.controls)[0]) {
		const ongoingCost = this.fb.group(ongoingCostForm);

		subtask.controls['ongoingCosts'].push(ongoingCost);
	}

	removeOngoingCost(
		subtask: (typeof this.subtasks.controls)[0],
		index: number
	) {
		subtask.controls['ongoingCosts'].removeAt(index);
	}

	ngOnDestroy() {
		this.editing$.next('');
		this.quoteService.currentEstimate$.next(0);
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
