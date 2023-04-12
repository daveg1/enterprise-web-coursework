import { Component, OnDestroy } from '@angular/core';
import { PaygradeService } from 'src/app/services/paygrade.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Paygrade, PaygradeDialogForm } from 'src/app/types/paygrade';
import { NonNullableFormBuilder } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { NewPaygradeDialogComponent } from 'src/app/components/dialogs/new-paygrade-dialog/new-paygrade-dialog.component';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
})
export class AdminComponent implements OnDestroy {
	paygradeForm;

	private paygradesRow = {
		id: '',
		role: '',
		hourlyRate: 0,
	};

	private readonly unsubscribe$ = new Subject<void>();

	constructor(
		private readonly paygradeService: PaygradeService,
		readonly dialog: Dialog,
		readonly fb: NonNullableFormBuilder
	) {
		// Allow paygradeForm to infer the type
		this.paygradeForm = this.fb.group({
			paygrades: this.fb.array([this.fb.group(this.paygradesRow)]),
		});

		// Refresh list
		this.refreshPaygrades();
	}

	private refreshPaygrades() {
		this.paygradeForm.controls['paygrades'].clear();

		this.paygradeService
			.getPaygrades()
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe({
				next: (paygrades) => {
					paygrades.forEach((paygrade) => {
						const row = this.fb.group(this.paygradesRow);
						row.controls['id'].setValue(paygrade._id);
						row.controls['role'].setValue(paygrade.role);
						row.controls['hourlyRate'].setValue(paygrade.hourlyRate);

						this.paygradeForm.controls['paygrades'].push(row);
					});
				},
			});
	}

	addPaygrade() {
		const dialogRef = this.dialog.open<PaygradeDialogForm>(
			NewPaygradeDialogComponent,
			{
				width: '20rem',
			}
		);

		dialogRef.closed.subscribe({
			next: (paygrade) => {
				if (!paygrade) {
					return;
				}

				this.paygradeService
					.addPaygrade(paygrade)
					.pipe(takeUntil(this.unsubscribe$))
					.subscribe({
						next: () => {
							this.refreshPaygrades();
						},
					});
			},
		});
	}

	removePaygrade(index: number) {
		const row = this.paygradeForm.controls['paygrades'].at(index);
		const paygradeId = row.controls['id'].value;

		this.paygradeService
			.deletePaygrade(paygradeId)
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe({
				next: (res) => {
					console.log(res);
					this.refreshPaygrades();
				},
			});
	}

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
