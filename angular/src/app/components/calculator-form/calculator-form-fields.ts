import { Validators } from '@angular/forms';

export const timeUnits = ['hours', 'days', 'months'];
export const payGrades = ['junior', 'standard', 'senior'];
export const frequencies = ['weekly', 'monthly'];

export const workerForm = {
	timeWorked: 0,
	timeUnit: timeUnits[0],
	payGrade: payGrades[0],
};

export const oneOffCostForm = {
	itemName: ['', Validators.maxLength(64)],
	cost: 0,
};

export const ongoingCostForm = {
	itemName: '',
	cost: 0,
	amount: 0,
	frequency: frequencies[0],
};
