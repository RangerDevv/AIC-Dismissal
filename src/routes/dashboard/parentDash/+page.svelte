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
                console.log(children);
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
        // Callback function automatically called when location services initialized in iOS app
    function median_geolocation_ready() {
    // Define the locationSuccess function
    function locationSuccess(position:any) {
        // Handle the success callback logic here
        // console.log(position);
        // Get the user's latitude and longitude coordinates
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        isLocationAccessGranted = true;
        // Update the map with the user's new location
        // console.log(`Latitude: ${lat}, longitude: ${lng}`);
        
        // check if the user is within 100 meters of the mosque
        let R = 6371e3; // Earth's radius in meters
        let φ1 = lat * Math.PI/180; // Convert latitude from degrees to radians
        let φ2 = mosqueLat * Math.PI/180; // Convert mosque latitude from degrees to radians
        let Δφ = (mosqueLat-lat) * Math.PI/180; // Difference of latitudes
        let Δλ = (mosqueLng-lng) * Math.PI/180; // Difference of longitudes

        let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        let distance = R * c; // Distance in meters

        isNearMosque = distance < 100 ? true : false;
        locationLoading = false;
    }

    // Call the getCurrentPosition method with the defined locationSuccess function
    function locationError(error:any) {
        console.log(error);
    }

    const locationOptions = {}; // Declare locationOptions variable
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {enableHighAccuracy: true}); // Call the getCurrentPosition method with the defined locationSuccess function
    }
        
// Use callback function as a helper function and call immediately if not in iOS app
// console.log(navigator.userAgent);
if (navigator.userAgent.includes('MedianIOS')) {
  median_geolocation_ready();
} else {
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
        // console.log(`Latitude: ${lat}, longitude: ${lng}`);

        // if the user is within 100 meters of the mosque then send the notification
        let R = 6371e3; // Earth's radius in meters
        let φ1 = lat * Math.PI/180; // Convert latitude from degrees to radians
        let φ2 = mosqueLat * Math.PI/180; // Convert mosque latitude from degrees to radians
        let Δφ = (mosqueLat-lat) * Math.PI/180; // Difference of latitudes
        let Δλ = (mosqueLng-lng) * Math.PI/180; // Difference of longitudes

        let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        let distance = R * c; // Distance in meters

        isNearMosque = distance < 100 ? true : false;
        locationLoading = false;
        },
        // Error callback function
        function(error) {
        // Handle errors, e.g. user denied location sharing permissions
        console.error("Error getting user location:", error);
        isLocationAccessGranted = false;
        locationLoading = false;
        }
    );
    } else {
    // Geolocation is not supported by the browser
    console.error("Geolocation is not supported by this browser.");
    }
}
});

    async function isArrived(e:any) {
        const close = document.getElementById('notify') as HTMLInputElement;
if(close){
        close.click();
}
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
                    <!-- {#if locationLoading}
                    <span class="loading loading-spinner loading-lg mt-5"></span>
                    {:else}
                    {#if isLocationAccessGranted}
                    {#if isNearMosque} -->
                    <!-- <button class="btn btn-success">Arrived</button> -->
                        <input type="checkbox" bind:checked={arrivedBool} id="{child.Name}" name="{child.Name}" value="{child.$id}"  class='checkbox checkbox-success checkbox-md rounded-full' on:change={isArrived}>
                    <!-- {:else}
                    <div class="flex flex-col just-end items-end">
                    {#if arrivedBool}
                    <label for="notify" class="btn btn-ghost outline outline-green-600 text-green-600 m-6" id="warning">Notified</label>
                    {:else}
                    <label for="notify" class="btn btn-ghost outline outline-rose-600 text-rose-600 m-2" id="warning">Notify Anyway</label>
                    {/if}
                    <p class="w-36 text-sm">Notify when close to the mosque.</p>
                    </div>
                    <input type="checkbox" id="notify" class="modal-toggle" />
                    <div class="modal" role="dialog">
                    <div class="modal-box">
                        <h1 class="text-3xl font-bold text-center pt-5">Are you sure you want to notify the mosque?</h1>
                        <div class="flex flex-col justify-center items-center">
                            <label class="flex flex-col gap-2 cursor-pointer items-center">
                            <span class="label-text mt-5 text-lg">Yes</span> 
                            <input type="checkbox" bind:checked={arrivedBool} id="{child.Name}" name="{child.Name}" value="{child.$id}"  class='checkbox checkbox-success checkbox-lg rounded-full' on:change={isArrived}>
                            </label>
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
                    {/if} -->
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

<style>
    .modal-box *{
        transition: all .3s ease;
    }

    #alert{
        display: hidden;
    }
</style>
