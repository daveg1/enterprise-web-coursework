export type Budget = {
	workers: {
		timeWorked: number;
		timeUnit: string;
		payGrade: string;
	}[];

	oneOffCosts: {
		itemName: string;
		cost: number;
	}[];

	ongoingCosts: {
		itemName: string;
		cost: number;
		frequency: string;
	}[];
};
