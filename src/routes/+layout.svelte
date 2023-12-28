<script lang='ts'>
    import "../app.css";
    import { appwriteUser } from "$lib/appwrite";
    import { goto } from "$app/navigation";

    export let isLoggedIn = false;

    async function sesh(){ 
        appwriteUser.getSession('current').then((res) => {
        console.log('ye')
        appwriteUser.get().then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
        console.log(res);
        isLoggedIn = true;
        return res;
        }).catch((err) => {
        console.log(err);
        isLoggedIn = false;
        return err;
        });
    }

    sesh();

    function logout(){
        appwriteUser.deleteSession('current').then((res) => {
        console.log(res);
        isLoggedIn = false;
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
        <div class="flex flex-row gap-3">
            {#if !isLoggedIn}
            <a href="/loginRegister/register"><button class="btn btn-primary">Register</button></a>
            <a href="/loginRegister/login"><button class="btn">Login</button></a>
            {/if}
            {#if isLoggedIn}
            <a href="/dashboard/parentDash"><button class="btn btn-primary">Home</button></a>
            <a href="/dashboard/teacherDash/658c81599273893f19ea"><button class="btn">Go to Classroom</button></a>
            <button class="btn btn-primary" on:click={logout}>Logout</button>
            {/if}
        </div>
    </nav>
    <slot />
</main>