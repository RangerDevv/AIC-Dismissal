<script lang="ts">
    import { appwriteDatabases,appwriteUser } from "$lib/appwrite";
    import { DB_ID,COLLECTION } from "$lib/ids";
    import { Query,ID } from "appwrite";

    let uuid = '';
    let parentDBID = '';
    let children = [] as any[];

    let newChildName = '';
    let newChildClass = '';

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
            console.log(res);
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
                parentDBID = res.documents[0]['$id'];
                children = res.documents[0]['students'];
                console.log(children);
        }).catch((err) => {
            console.log(err);
        });
        }).catch((err) => {
            console.log(err);
        });
    }

    getChildren();

    async function isArrived(e:any) {
        await appwriteDatabases.updateDocument(DB_ID,COLLECTION.Parents,parentDBID,
            {
                Arrived:e.target.checked
            }
        ).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    }
</script>

<main>
<h1 class="text-3xl font-bold text-center pt-5">Parent Dashboard</h1>
<div>
    <label for="my_modal_6" class="btn btn-ghost outline m-6">Add Child</label>
    {#if children.length == 0}
    <h1 class="text-3xl font-bold text-center pt-5">You have no children</h1>
    {:else}
    <h1 class="text-3xl font-bold text-center pt-5 mb-4">Your Children</h1>
    {#each children as child}
    <!-- if the array is empty say that you have no children -->
    <div class="flex flex-col items-center justify-center">
        <div class="flex flex-col gap-3 w-full">
            <div class="flex flex-row pb-3">
                <div class="flex-1 pl-5">
                    <h1 class="text-2xl font-bold pt-5">{child.Name}</h1>
                </div>
                <div class="flex flex-row gap-3 pr-4">
                    <button class="btn btn-error">Late</button>
                    <!-- <button class="btn btn-success">Arrived</button> -->
                    <input type="checkbox" id="{child.Name}" name="{child.Name}" value="{child.$id}" checked={child.Sent} class='checkbox checkbox-success rounded-full' on:change={isArrived}>
                </div>
            </div>
        </div>
    </div>
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