<script lang="ts">
    import { register } from "$lib/user";

    let email = "";
    let name = "";
    let password = "";

    function registerUser() {
        register(email, password,name);
    }

</script>

<div class="container">

    <h1>Register</h1>

    <form on:submit|preventDefault={registerUser}>
        <label for="email">Email</label>
        <input type="email" id="email" bind:value={email} />
        <label for="name">Name</label>
        <input type="text" id="name" bind:value={name} />
        <label for="password">Password</label>
        <input type="password" id="password" bind:value={password} />
        <button class="btn btn-success" type="submit">Register</button>
    </form>

</div>