import { goto } from '$app/navigation';
import { appwriteUser,appwriteDatabases } from './appwrite';
import { ID } from 'appwrite';
import { DB_ID,COLLECTION } from './ids';
import { writable,get } from 'svelte/store';

let uuid = '';



export async function register(email:any, password:any, name:any, birthDate:any) {
    try {
        await appwriteUser.create(ID.unique(),email, password,name).then((res:any) =>{
            login(email, password).then(async (res:any) => {
            appwriteUser.get().then((res:any) => {
                uuid = res.$id;
                appwriteDatabases.createDocument(DB_ID, COLLECTION.Parents,ID.unique(), {
                    Name: name,
                    DOB: birthDate,
                    uid: uuid,
                }).then((res:any) => {
                    console.log(res);
                    goto("/dashboard/parentDash");
                }
                );
            });
        });
            console.log(res);
        });
    } catch (error) {
        console.error(error);
        return error;
    }
}

export async function login(email:any, password:any, errorMessage?:any) {
    try {
        await appwriteUser.createEmailSession(email, password).then((res:any) => {
            console.log(res);
        });

        goto("/dashboard/parentDash");
    } catch (error) {
        console.error(error);
        return error;
    }
}