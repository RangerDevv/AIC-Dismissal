<script lang="ts">
    import { browser } from "$app/environment";
    import { appwriteDatabases,appwriteUser,appwriteClient } from "$lib/appwrite";
    import { DB_ID,COLLECTION } from "$lib/ids";
    import { Query,ID } from "appwrite";
    import { onDestroy, onMount } from "svelte";

    let uuid = '';
    let parentDBID = '';
    let children = [] as any[];
    let arrivedBool = null;

    let newChildName = '';
    let newChildClass = '';

    let mosqueLat = 40.409188652472295;
    let mosqueLng = -80.08315067761669;

    let isNearMosque = false;
    let isLocationAccessGranted = false;


    let my_modal_6 = document.getElementById('my_modal_6') as HTMLInputElement;

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
            // uncheck the modal
            my_modal_6.checked = false;
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
                console.log(children);
        }).catch((err) => {
            // console.log(err);
        });
        }).catch((err) => {
            console.log(err);
        });
    }

    onMount(async () =>{ 
        getChildren();
            // Check if geolocation is supported by the browser
    if ("geolocation" in navigator) {
    // Prompt user for permission to access their location
    isLocationAccessGranted = true;
    navigator.geolocation.watchPosition(
        // Success callback function
        function(position) {
        // Get the user's latitude and longitude coordinates
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Update the map with the user's new location
        console.log(`Latitude: ${lat}, longitude: ${lng}`);

        // if the user is within 100 meters of the mosque then send the notification
        Math.sqrt(Math.pow(mosqueLat - lat, 2) + Math.pow(mosqueLng - lng, 2)) * 100000 < 100 ? isNearMosque=true : isNearMosque=false;
        },
        // Error callback function
        function(error) {
        // Handle errors, e.g. user denied location sharing permissions
        console.error("Error getting user location:", error);
        isLocationAccessGranted = false;
        }
    );
    } else {
    // Geolocation is not supported by the browser
    console.error("Geolocation is not supported by this browser.");
    }
    });

    async function isArrived(e:any) {
        await appwriteDatabases.updateDocument(DB_ID,COLLECTION.Parents,parentDBID,
            {
                Arrived:e.target.checked
            }
        ).then((res) => {
            // console.log(res);
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
    <label for="my_modal_6" class="btn btn-ghost outline m-6">Add Child</label>
    {#if children.length == 0}
    <h1 class="text-3xl font-bold text-center pt-5">You have no children</h1>
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
                    <h2 class="text-sm">{child.class.Name}</h2>
                </div>
                <div class="flex flex-row gap-10 pr-4">
                    {#if isLocationAccessGranted}
                    {#if isNearMosque}
                    <!-- <button class="btn btn-success">Arrived</button> -->
                    <input type="checkbox" bind:checked={arrivedBool} id="{child.Name}" name="{child.Name}" value="{child.$id}"  class='checkbox checkbox-success rounded-full' on:change={isArrived}>
                    {:else}
                    <div class="flex flex-col just-end items-end">
                    <p class="">You are not close to the mosque yet!</p>
                    {#if arrivedBool}
                    <label for="notify" class="btn btn-ghost outline outline-green-600 text-green-600 m-6" id="warning">Notified</label>
                    {:else}
                    <label for="notify" class="btn btn-ghost outline outline-rose-600 text-rose-600 m-6" id="warning">Notify Anyway</label>
                    {/if}
                    </div>
                    <input type="checkbox" id="notify" class="modal-toggle" />
                    <div class="modal" role="dialog">
                    <div class="modal-box">
                        <h1 class="text-3xl font-bold text-center pt-5">Are you sure you want to notify the mosque?</h1>
                        <div class="flex flex-row justify-center items-center">
                            <input type="checkbox" bind:checked={arrivedBool} id="{child.Name}" name="{child.Name}" value="{child.$id}"  class='checkbox checkbox-success checkbox-lg mt-10 rounded-full' on:change={isArrived}>
                        </div>
                        <div class="modal-action">
                            <label for="notify" class="btn btn-error">Close</label>
                        </div>
                    </div>
                    </div>
                    {/if}
                    {:else}
                    <label for="notify" class="btn btn-ghost outline outline-rose-600 text-rose-600 m-6" id="warning">Please Grant Location Access</label>
                    {/if}
                </div>
            </div>
        </div>
    </div>
    {/each}
    {/if}

    <h1 class="text-3xl font-bold text-center pt-5 mb-4">Children Status</h1>
    {#if children.length == 0}
    <h1 class="text-3xl font-bold text-center pt-5">You have no children</h1>
    {:else}
    {#each children as child}
        {#if child.Sent}
        <div class="flex flex-row gap-2 mx-auto pb-2 justify-start pl-10 items-center">
            <input type="checkbox" class="checkbox checkbox-success rounded-full disabled:opacity-100 disabled:bg-red-700" checked={child.Sent} disabled>
            <p>{child.Name} has been sent</p>
        </div>
        {:else}
        <div class="flex flex-row gap-2 mx-auto pb-2 justify-start pl-10 items-center">
            <input type="checkbox" class="checkbox checkbox-success rounded-full disabled:opacity-100 disabled:bg-red-700" checked={child.Sent} disabled>
            <p>{child.Name} has not been sent yet please be patient</p>
        </div>
        {/if}
    {/each}
    {/if}
</div>
</main>
<input type="checkbox" id="my_modal_6" class="modal-toggle" />
<div class="modal" role="dialog">
  <div class="modal-box">
    <input type="text" placeholder="Child Name" bind:value={newChildName} class="input input-bordered"/>
    <select class="select select-bordered" bind:value={newChildClass}>
        <option value="658c813d020c227f7ae2">Fatima-1</option>
        <option value="658c81599273893f19ea">Youth</option>
    </select>
    <div class="modal-action">
        <button class="btn btn-primary" on:click={addChild}>Add Child</button>
        <label for="my_modal_6" class="btn btn-error">Close</label>
    </div>
  </div>
</div>