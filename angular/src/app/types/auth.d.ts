export type AuthSignUp = {
	firstname: string;
	lastname: string;
	username: string;
	password: string;
};

export type AuthSignUpResponse = {
	firstname: string;
};

export type AuthLogin = {
	username: string;
	password: string;
};

export type AuthResponse = {
	username: string;
	token: string;
	quotes: any[];
};
