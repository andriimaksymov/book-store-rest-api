namespace NodeJS {
	interface ProcessEnv {
		API_URL: string;
		PORT: string;
		NODE_ENV: string;
		JWT_SECRET: string;
		[key: string]: string | undefined;
	}
}
