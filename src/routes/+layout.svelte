<script lang='ts'>
    import "../app.css";
    import { appwriteUser,appwriteDatabases } from "$lib/appwrite";
    import { DB_ID,COLLECTION } from "$lib/ids";
    import { goto } from "$app/navigation";
    import { Query } from "appwrite";
    import { browser } from "$app/environment";

    export let isLoggedIn = false;
    let loading = true;
    let teacher = false;

    let uid = '';

    async function sesh(){ 
        appwriteUser.getSession('current').then((res) => {
            isLoggedIn = true;
        appwriteUser.get().then((res) => {
            // console.log(res);
            isLoggedIn = true;
            uid = res['$id'];
                appwriteDatabases.listDocuments(DB_ID,COLLECTION.Parents,[Query.equal('uid',[res['$id']])]).then((res:any) => {
                    teacher = res['documents'][0]['isTeacher'];
                    isLoggedIn = true;
                    loading = false;
                }).catch((err) => {
                    console.log(err);
                });
        }).catch((err) => {
            console.log(err);
        });
        console.log(res);
        isLoggedIn = true;
        loading = false;
        return res;
        }).catch((err) => {
        console.log(err);
        isLoggedIn = false;
        loading = false;
        return err;
        });
    }


    if(browser) sesh()

    if(!isLoggedIn){
    setInterval(() => {
        !isLoggedIn && sesh()
    }, 1000);
    }

    function logout(){
        appwriteUser.deleteSession('current').then((res) => {
        console.log(res);
        isLoggedIn = false;
        goto('/')
        return res;
        }).catch((err) => {
        console.log(err);
        isLoggedIn = false;
        goto('/')
        return err;
        });
    }
</script>

<main>
    <nav class="navbar bg-green-300">
        <div class="flex-1">
            <a href="/"><img src="https://www.attawheed.org/uploads/1/1/0/6/110609037/logo-with-text-islamic-center-arabic_1.png" alt="logo" class="h-14 w-auto"/></a>
        </div>
        {#if loading}
        <div class="flex-1">
            <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
        </div>
        {:else}
        <div class="flex flex-row gap-3">
            {#if !isLoggedIn}
            <a href="/loginRegister/register"><button class="btn btn-primary">Register</button></a>
            <a href="/loginRegister/login"><button class="btn">Login</button></a>
            {/if}
            {#if isLoggedIn}
            {#if teacher}
            <a href="/dashboard/teacherDash/"><button class="btn">All Classroom</button></a>
            {#if uid == '659b001f1dd2ea90b3ed' || uid == '658c6e971bcb4f11e387'}
            <ul class="menu menu-horizontal px-1">
            <li>
                <details>
                  <summary class="hover:bg-slate-900 btn text-base">
                    Admin
                  </summary>
                  <ul class="p-2 rounded-t-none bg-slate-800">
                    <li><a href="/allUsers">Users</a></li>
                    <!-- <li><a>Logs</a></li> -->
                  </ul>
                </details>
            </li>
            </ul>
            {/if}
            {/if}
            <button class="btn btn-primary" on:click={logout}>Logout</button>
            {/if}
        </div>
        {/if}
    </nav>
    <slot />
</main>