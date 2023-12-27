import { Client, Account, ID, Databases, Permission, Role, Teams, Storage } from 'appwrite';


export const client = new Client();

export const appwriteClient = client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('658a376312b6f04fbe81');

export const appwriteDatabases = new Databases(appwriteClient);
export const appwriteStorage = new Storage(appwriteClient);
export const appwriteUser = new Account(appwriteClient);
export const appwriteTeams = new Teams(appwriteClient);