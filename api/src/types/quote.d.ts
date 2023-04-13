import { Schema } from 'mongoose'
import type { Subtask } from './subtask'

export type Quote = {
	subtasks: Subtask[]
	estimate: number
	projectName: string
	user: typeof Schema.Types.ObjectId
}
