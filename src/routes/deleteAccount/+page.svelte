<script>
    import { goto } from '$app/navigation';
    let email = '';
    let message = '';
    async function deleteAccount(){
        if(email == ''){
            message = 'Please enter your email';
            return;
        } else {
            // if the email has the @ symbol
            if(email.includes('@')){
                // send a request to delete the account
                // and then redirect to the home page
                // with a message that the account will be deleted soon
            message = 'Request sent your account will be deleted soon';
            } else {
                message = 'Please enter a valid email';
            }
        }
    }
</script>

<p class="text-2xl text-center text-white font-bold pt-10">Request Account Deletion</p>

<div class="flex flex-col justify-center items-center">
<input type="text" class="input input-lg mt-5 mb-5" placeholder="Enter your email" bind:value={email}/>
<p class="message text-red-500">{message}</p>
<button class="btn" on:click={deleteAccount}>Delete Account</button>
</div>