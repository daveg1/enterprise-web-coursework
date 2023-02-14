export type Budget = {
	workers: [
		{
			timeWorked: number;
			timeUnit: string;
			payGrade: string;
		}
	];
	oneOffCost: number;
	ongoingCost: number;
	ongoingFrequency: string;
};
