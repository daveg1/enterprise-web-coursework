export type Budget = {
	workers?: {
		timeWorked?: number
		timeUnit?: 'hours' | 'days' | 'months'
		payGrade?: 'junior' | 'standard' | 'senior'
	}[]

	oneOffCosts?: {
		itemName?: string
		cost?: number
	}[]

	ongoingCosts?: {
		itemName?: string
		cost?: number
		amount?: number
		frequency?: 'weekly' | 'monthly'
	}[]
}
