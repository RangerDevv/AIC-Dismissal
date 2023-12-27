<script lang="ts">
    import { login } from "$lib/user";

    let email = "";
    let password = "";

    function loginUser() {
        login(email, password);
    }
</script>

<div class="container">
    <h1>Login</h1>
    <form on:submit|preventDefault={loginUser}>
        <label for="email">Email</label>
        <input type="email" id="email" bind:value={email} />
        <label for="password">Password</label>
        <input type="password" id="password" bind:value={password} />
        <button class="btn btn-success" type="submit">Login</button>
    </form>
</div>