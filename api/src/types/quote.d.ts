import { Schema } from 'mongoose'
import type { Budget } from './budget'

export type Quote = {
	budget: Budget
	estimate: number
	projectName: string
	user: typeof Schema.Types.ObjectId
}
