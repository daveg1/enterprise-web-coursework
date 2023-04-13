export type Subtask = {
	workers?: {
		timeWorked?: number
		timeUnit?: 'hours' | 'days' | 'months'
		payGrade?: string
	}[]

	oneOffCosts?: {
		itemName?: string
		cost?: number
	}[]

	ongoingCosts?: {
		itemName?: string
		cost?: number
		frequency?: 'weekly' | 'monthly'
	}[]
}
