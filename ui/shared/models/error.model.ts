import {IPeerState} from "../slices/createSession.slice";

export interface IError extends Error, Partial<IPeerState> {
    status?: number;
    message: string;
}