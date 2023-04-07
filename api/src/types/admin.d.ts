import { Schema } from 'mongoose'

export type Admin = {
	user: typeof Schema.Types.ObjectId
}
