<script lang="ts">
    import { browser } from "$app/environment";
    import { appwriteDatabases,appwriteUser,appwriteClient } from "$lib/appwrite";
    import { DB_ID,COLLECTION } from "$lib/ids";
    import { Query,ID } from "appwrite";
    import { onMount } from "svelte";

    let uuid = '';
    let parentDBID = '';
    let children = [] as any[];
    let arrivedBool = false;
    let loading = true;

    let newChildName = '';
    let newChildClass = '';

    let mosqueLat = 40.40920469987484;
    let mosqueLng = -80.083139337501;
    let locationLoading = true;

    let isNearMosque = null as boolean | null;
    let isLocationAccessGranted = false;

    let classList = [] as any[];

    async function listClasses() {
        await appwriteDatabases.listDocuments(DB_ID,COLLECTION.Class).then((res) => {
            console.log(res);
            classList = res['documents'] as any[];
        }).catch((err) => {
            console.log(err);
        });
    }

    async function addChild() {
        console.log(newChildName);
        console.log(newChildClass);
        console.log(parentDBID);
        await appwriteDatabases.createDocument(DB_ID,COLLECTION.Students,ID.unique(),
            {
                Name:newChildName,
                class:newChildClass,
                parents:parentDBID
            }
        ).then((res) => {
            // console.log(res);
            getChildren();
            newChildClass = '';
            newChildName = '';
        }).catch((err) => {
            console.log(err);
        });
    }

    async function getChildren() {
        appwriteUser.get().then((res) => {
            uuid = res['$id'];
            console.log('UUID '+uuid);
            appwriteDatabases.listDocuments(DB_ID,COLLECTION.Parents,[Query.equal('uid',[uuid])]).then((res) => {
                arrivedBool = res.documents[0]['Arrived'];
                parentDBID = res.documents[0]['$id'];
                children = res.documents[0]['students'];
                loading = false;
                if(children.length == 0) {
                    loading = false;
                }
        }).catch((err) => {
            // console.log(err);
        });
        }).catch((err) => {
            console.log(err);
        });
    }

    async function updateChildren() {
        await appwriteDatabases.updateDocument(DB_ID,COLLECTION.Parents,parentDBID,
            {
                students:[...children]
            }
        ).then((res) => {
            // console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    }

    async function deleteChildren(e:any) {
        const close = document.getElementById('childEditList') as HTMLInputElement;
        close.click();
        await appwriteDatabases.deleteDocument(DB_ID,COLLECTION.Students,e).then((res) => {
            // console.log(res);
            getChildren();
        }).catch((err) => {
            console.log(err);
        });
    }

    onMount(async () =>{ 
        listClasses();
        getChildren();
});

    async function isArrived(e:any) {
        await appwriteDatabases.updateDocument(DB_ID,COLLECTION.Students,e.target.value,
            {
                Arrived:e.target.checked
            }
        ).then((res) => {
            console.log(res);
            // simulate the click of the close button of the notify modal
        }).catch((err) => {
            console.log(err);
        });
        await appwriteDatabases.updateDocument(DB_ID,COLLECTION.Parents,parentDBID,
            {
                Arrived:e.target.checked
            }
        ).then((res) => {
            // console.log(res);
            // simulate the click of the close button of the notify modal
        }).catch((err) => {
            console.log(err);
        });
    }

    async function isReceived(e:any) {
        await appwriteDatabases.updateDocument(DB_ID,COLLECTION.Students,e.target.value,
            {
                Received:e.target.checked
            }
        ).then((res) => {
            console.log(res);
            // simulate the click of the close button of the notify modal
        }).catch((err) => {
            console.log(err);
        });
    }

    const unsubscribe = browser ? appwriteClient.subscribe('databases.'+DB_ID+'.collections.'+COLLECTION.Students+'.documents', res => {
        // find the child using $id that was updated and update it in the array
        const payload = res.payload as any;
        children.find((child) => child.$id == payload.$id).Sent = payload.Sent;
        // refresh the array
        children = [...children];
    }) : undefined;


    onMount(() => {
        return () => {
            unsubscribe!();
        };
    });

</script>

<main>
<h1 class="text-3xl font-bold text-center pt-5">Parent Dashboard</h1>
<div>
    {#if loading}
    <div class="flex flex-col justify-center items-center">
        <span class="loading loading-spinner loading-lg mt-5"></span>
    </div>
    {:else}
    {#if children.length == 0}
    <div class="flex flex-col justify-center items-center">
        <h1 class="text-xl font-bold text-center pt-5">You have no children</h1>
        <label for="my_modal_6" class="btn btn-ghost outline m-3 w-96">Add Child</label>
    </div>
    {:else}
    <h1 class="text-3xl font-bold text-center pt-5 mb-4">Your Children</h1>

    <div class="flex flex-col items-center justify-center">
        <div class="flex flex-col gap-3 w-full">
            <div class="flex flex-row pb-2">
                <div class="flex-1 pl-5">
                    <h1 class="font-bold">Name</h1>
                </div>
                <div class="flex flex-row gap-3 pr-4">
                    <!-- <button class="btn btn-success">Arrived</button> -->
                    <p class="font-bold">Arrived</p>
                </div>
            </div>
        </div>
    </div>
    {#each children as child}
    <!-- if the array is empty say that you have no children -->
    <div class="flex flex-col items-center justify-center">
        <div class="flex flex-col gap-3 w-full">
            <div class="flex flex-row pb-3">
                <div class="flex-1 pl-5">
                    <h1 class="text-2xl pt-5">{child.Name}</h1>
                    <h2 class="text-sm">Class: {child.class.Name}</h2>
                </div>
                <div class="flex flex-row gap-10 pr-4">
                        <input type="checkbox" bind:checked={child.Arrived} id="{child.$id}" name="{child.Name}" value="{child.$id}" class='checkbox checkbox-success rounded-full' on:change={isArrived}>
                </div>
            </div>
        </div>
    </div>
    {/each}
    <div class="flex flex-col justify-center items-center">
        <!-- <h1 class="text-xl font-bold text-center pt-5">You have no children</h1> -->
        <label for="my_modal_6" class="btn btn-ghost outline m-3 w-72 sm:w-96">Add Child</label>
        {#if children.length > 0}
        <label for="childEditList" class="btn btn-ghost outline m-3 w-72 sm:w-96">Edit Child List</label>
        {/if}
    </div>
    {/if}

    <h1 class="text-3xl font-bold text-center pt-5 mb-2">Children Status</h1>
    {#if children.length == 0}
    <h1 class="text-xl font-bold text-center pt-3">You have no children</h1>
    {:else}
    {#each children as child}
    <div id="lebels" class="flex flex-row gap-2 mx-auto pb-2 justify-between pl-10 items-center">
        <p class="font-bold">Status</p>
        <p class="font-bold mr-4">Received</p>
    </div>
        {#if child.Sent}
        <div class="flex flex-row gap-2 mx-auto pb-2 justify-start pl-10 items-center">
            <div class="flex-1 flex gap-2 flex-row">
            <input type="checkbox" class="checkbox checkbox-success rounded-full disabled:opacity-100 disabled:bg-red-700" checked={child.Sent} disabled>
            <p>{child.Name} has been sent</p>
            </div>
            <!-- received button -->
            <input type="checkbox" bind:checked={child.Received} id="{child.$id}" name="{child.Name}" value="{child.$id}" class='checkbox checkbox-info rounded-full mr-8' on:change={isReceived}>
        </div>
        {:else}
        <div class="flex flex-row gap-2 mx-auto pb-2 justify-start pl-10 items-center">
            <div class="flex-1 flex gap-2 flex-row">
            <input type="checkbox" class="checkbox checkbox-success rounded-full disabled:opacity-100 disabled:bg-red-700" checked={child.Sent} disabled>
            <p>{child.Name} has not been sent yet please be patient</p>
            </div>
            <input type="checkbox" bind:checked={child.Received} id="{child.$id}" name="{child.Name}" value="{child.$id}" class='checkbox checkbox-info rounded-full mr-8' on:change={isReceived} disabled>
        </div>
        {/if}
    {/each}
    {/if}
    {/if}
    <div class="flex flex-col justify-center items-center">
        <!-- <h1 class="text-xl font-bold text-center pt-5">You have no children</h1> -->

    </div>
</div>
</main>
<input type="checkbox" id="my_modal_6" class="modal-toggle" />
<div class="modal" role="dialog">
  <div class="modal-box">
    <input type="text" placeholder="Child Name" bind:value={newChildName} class="input input-bordered"/>
    <select class="select select-bordered" bind:value={newChildClass}>
        <option value="">Select Class</option>
        {#each classList as allClass}
        <option value="{allClass.$id}">{allClass.Name}</option>
        {/each}
    </select>
    <div class="modal-action">
        <label for="my_modal_6" class="btn btn-success" on:click={addChild}>Add Child</label>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <label for="my_modal_6" class="btn btn-error">Close</label>
    </div>
  </div>
</div>

<input type="checkbox" id="childEditList" class="modal-toggle" />
<div class="modal" role="dialog">
  <div class="modal-box">
    <div class="flex flex-col gap-3 w-full">
        {#each children as child}
        <div class="flex flex-row gap-4">
            <input type="text" placeholder="Child Name" bind:value={child.Name} class="input input-bordered w-full"/>
            <!-- delete button -->
            <button class="btn btn-error" on:click={() => deleteChildren(child.$id)}>Delete</button>
        </div>
        {/each}
    </div>
    <div class="modal-action">
        <label for="childEditList" class="btn btn-success" on:click={updateChildren}>Update</label>
        <label for="childEditList" class="btn btn-error">Close</label>
    </div>
  </div>
</div>
<!-- align the footer at the bottom of the page -->
<footer class="fixed bottom-0 w-full pt-5">
    <div class="p-2 text-center">
        <p class="text-gray-400">To request account deletion please go to <a href="/deleteAccount">Delete Account Page</a></p>
    </div>
</footer>
<style>
    .modal-box *{
        transition: all .3s ease;
    }

    #alert{
        display: hidden;
    }
</style>
