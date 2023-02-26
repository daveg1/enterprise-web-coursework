import type { Quote } from './quote'

export type User = {
	username: string
	password: string
	firstname: string
	lastname: string
	quotes: Quote[]
}
