<script lang='ts'>
    import "../app.css";
    import { appwriteUser } from "$lib/appwrite";

    let currSesh = appwriteUser.getSession('current');
    console.log(currSesh);
</script>

<main>
    <nav class="navbar bg-green-300">
        <div class="flex-1">
            <a href="/"><img src="https://www.attawheed.org/uploads/1/1/0/6/110609037/logo-with-text-islamic-center-arabic_1.png" alt="logo" class="h-14 w-auto"/></a>
        </div>
        <div class="flex flex-row gap-3">
            <a href="/"><button class="btn btn-primary">Home</button></a>
            <a href="/loginRegister/register"><button class="btn btn-primary">Register</button></a>
            <a href="/loginRegister/login"><button class="btn">Login</button></a>
        </div>
    </nav>
    <slot />
</main>