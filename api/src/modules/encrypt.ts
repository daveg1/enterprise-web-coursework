import bcrypt from 'bcrypt'

export function encrypt(password: string) {
	return bcrypt.hash(password, 10)
}

export async function verify(plainPassword, hashedPassword) {
	return bcrypt.compare(plainPassword, hashedPassword)
}
