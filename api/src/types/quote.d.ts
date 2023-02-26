import { Schema } from 'mongoose'
import type { Budget } from './budget'

export type Quote = {
	budget: Budget
	projectName: string
	user: typeof Schema.Types.ObjectId
}
