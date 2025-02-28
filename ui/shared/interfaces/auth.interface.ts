export interface IAuth {
    authorize: (sessionToken: string) => Promise<void>
}