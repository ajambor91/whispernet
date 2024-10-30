import {IClient} from "../models/client.model";
import {Client} from "../classes/client.class";

export type UserManager = {
    getUsers: () => IClient[],
    ifUserExists: (userToken: string) => boolean,
    getUser: (userToken: string) => IClient | undefined,
    addUser: (userToken: string, client: IClient) => void,
    removeUser: (userToken: string) => void,
    getOppositeUser: (userToken: string) => IClient | undefined,
    getUserBy: <K extends keyof  IClient>(prop: K, value: IClient[K]) => IClient | undefined,
    getUserByNot: <K extends keyof  IClient>(prop: K, value: IClient[K]) => IClient | undefined

};

const userMap: Map<string, IClient> = new Map();

const createUserManager = (): UserManager => {
    return {
        getUsers: () => Array.from(userMap.values()),
        getUser: (userToken: string) => userMap.get(userToken),
        addUser: (userToken: string, clientToAdd: IClient) => {
            if (!userMap.has(userToken)) {
                const client: IClient = new Client(clientToAdd)
                userMap.set(userToken, client);
            } else {
                throw new Error('Client exists')
            }
        },
        getOppositeUser: (userToken: string) => {
            return Array.from(userMap.values()).find(user => user.userToken !== userToken);
        },
        removeUser: (userToken: string) => {
            userMap.delete(userToken);
        },
        ifUserExists: (userToken: string) => userMap.has(userToken),
        getUserBy: <K extends keyof IClient>(prop: K, value: IClient[K]) => {
            return Array.from(userMap.values()).find(client => client[prop] === value)
        },
        getUserByNot: <K extends keyof IClient>(prop: K, value: IClient[K]) => {
            return Array.from(userMap.values()).find(client => client[prop] !== value)
        }
    }
};

export const getUserManager= createUserManager();
