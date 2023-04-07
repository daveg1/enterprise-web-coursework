import { model, Schema } from 'mongoose'
import { Admin } from '../types/admin'

const schema = new Schema<Admin>({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
})

const Admin = model('Admin', schema)

export { Admin }
