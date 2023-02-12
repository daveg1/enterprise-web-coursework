export type AuthSignUp = {
	firstname: string;
	lastname: string;
	username: string;
	password: string;
};

export type AuthSignUpResponse = {
	reason?: string;
	error?: Error;
	firstname?: string;
};

export type AuthLogin = {
	username: string;
	password: string;
};

export type AuthResponse = {
	token: string;
};
