<script lang="ts">
    import { appwriteUser } from "$lib/appwrite";
    import { browser } from "$app/environment";

    export let isLoggedIn = false;
    let isLoading = true;

    async function sesh(){ 
        appwriteUser.getSession('current').then((res) => {
          isLoggedIn = true;
        console.log(res);
        isLoggedIn = true;
        isLoading = false;
        window.location.href = '/dashboard/parentDash';
        return res;
        }).catch((err) => {
        console.log(err);
        isLoggedIn = false;
        isLoading = false;
        return err;
        });
    }


    if(browser) sesh()

    if(!isLoggedIn){
    setInterval(() => {
        !isLoggedIn && sesh()
    }, 1000);
    }
</script>

<div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      {#if isLoading}
      <img src="https://www.attawheed.org/uploads/1/1/0/6/110609037/logo-with-text-islamic-center-arabic_1.png" alt="logo" class="h-14 w-auto"/>
      {:else}
      {#if !isLoggedIn}
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Attawheed Dismissal System</h1>
        <p class="py-6">A better, faster, and more efficient experience.</p>
      <div>
        <a href="/loginRegister/register"><button class="btn btn-success">Get Started</button></a>
        <a href="/loginRegister/login"><button class="btn btn-primary">Login</button></a>

        </div>
      </div>
      {/if}
      {/if}
    </div>
</div>