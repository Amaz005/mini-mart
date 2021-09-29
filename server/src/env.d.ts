declare namespace NodeJS {
    export interface ProcessEnv {
        DATABASE_URL: string;
        REDIS_URL: string;
        PORT: string;
        SESSION_SECRET: 'hasgfhjaegwr';
        CORS_ORIGIN: 'http://localhost:3000';
    }
}