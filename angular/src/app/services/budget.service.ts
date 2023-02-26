import { Injectable } from '@angular/core';
import { Budget } from '../types/budget';

/**
 * This service keeps track of the current values in the quote calculator form.
 *
 * This is not to be confused with the quote service, which deals with the actual quote values.
 */
@Injectable({
	providedIn: 'root',
})
export class BudgetService {
	currentBudget?: Budget;
}
