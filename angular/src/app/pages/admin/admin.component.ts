import { Component, OnDestroy } from '@angular/core';
import { PaygradeService } from 'src/app/services/paygrade.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Paygrade } from 'src/app/types/paygrade';
import { NonNullableFormBuilder } from '@angular/forms';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
})
export class AdminComponent implements OnDestroy {
	paygradeForm;

	private paygradesForm = {
		role: '',
		hourlyRate: 0,
	};

	private readonly unsubscribe$ = new Subject<void>();

	constructor(
		private readonly paygradeService: PaygradeService,
		readonly fb: NonNullableFormBuilder
	) {
		// Allow paygradeForm to infer the type, then clear the form
		this.paygradeForm = this.fb.group({
			paygrades: this.fb.array([this.fb.group(this.paygradesForm)]),
		});
		this.paygradeForm.controls['paygrades'].clear();

		this.paygradeService
			.getPaygrades()
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe({
				next: (paygrades) => {
					paygrades.forEach((paygrade) => {
						const row = this.fb.group(this.paygradesForm);
						row.controls['role'].setValue(paygrade.role);
						row.controls['hourlyRate'].setValue(paygrade.hourlyRate);

						this.paygradeForm.controls['paygrades'].push(row);
					});
				},
			});
	}

	submitForm() {}

	addPaygrade() {
		const paygrade = this.fb.group(this.paygradesForm);
		this.paygradeForm.controls['paygrades'].push(paygrade);
	}

	removePaygrade(index: number) {
		this.paygradeForm.controls['paygrades'].removeAt(index);
	}

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
