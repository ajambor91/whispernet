export const apiURL: string = process.env.NEXT_PUBLIC_API_URL  ?? 'http://127.0.0.1:9099';
export const appURL: string = process.env.NEXT_PUBLIC_APP_URL  ?? '';

export const isDockerized: boolean = process.env.NEXT_PUBLIC_IS_DOCKERIZED as unknown === true || process.env.NEXT_PUBLIC_IS_DOCKERIZED as unknown === 'true';