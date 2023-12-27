import { goto } from '$app/navigation';
import { appwriteUser } from './appwrite';
import { ID } from 'appwrite';
import { writable,get } from 'svelte/store';

export const currUser = writable(null);
export const getCurrUser = get(currUser);


export async function register(email:any, password:any, name:any) {
    try {
        await appwriteUser.create(ID.unique(),email, password,name).then((res:any) => {
            console.log(res);
            currUser.set(res);

            console.log(getCurrUser);
        });

        goto("/");
    } catch (error) {
        console.error(error);
    }
}

export async function login(email:any, password:any) {
    try {
        await appwriteUser.createEmailSession(email, password).then((res:any) => {
            console.log(res);
            currUser.set(res);

            console.log(getCurrUser);

            document.cookie = `session=${res}; path=/`;
        });

        goto("/");
    } catch (error) {
        console.error(error);
    }
}