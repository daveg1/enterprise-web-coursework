export type Budget = {
	projectName: string;
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
