<script lang="ts">
    import { appwriteDatabases } from "$lib/appwrite";
    import { DB_ID,COLLECTION } from "$lib/ids";
    import { onMount } from "svelte";
    import { Query } from "appwrite";

    let parentList = [] as any[];
    let searchQuery = "";

    async function listClasses() {
        await appwriteDatabases.listDocuments(DB_ID, COLLECTION.Parents, searchQuery !== '' ? [Query.search('Name', searchQuery)] : undefined).then((res) => {
            // console.log(res);
            parentList = res['documents'];
            console.log(parentList);
        }).catch((err) => {
            console.log(err);
        });
    }

    onMount(() => {
        listClasses();
    });

    async function updateParent(id:string,checked:boolean) {
        await appwriteDatabases.updateDocument(DB_ID,COLLECTION.Parents,id,{
            isTeacher:checked
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    }
</script>

<main>
    <h1 class="text-3xl font-bold text-center pt-5">Users</h1>
    <div class="flex flex-row justify-center items-center">
        <div class="pt-5">
            <input type="text" placeholder="Search" class="input input-bordered w-80 max-w-xs" bind:value={searchQuery} on:input={listClasses} />
        </div>
    </div>
    <div class="flex flex-col items-center justify-center">
        <div class="flex flex-col gap-4 pt-10 w-full">
            {#each parentList as parent}
            <div class="flex flex-row w-full pl-4 pr-4">
                <div class="flex-1">
                    <h1 class="text-xl font-bold">{parent['Name']}</h1>
                </div>
                <div class="">
                    <input class="checkbox checkbox-accent checkbox-md" type="checkbox" bind:checked={parent.isTeacher} on:change={() => updateParent(parent['$id'],parent.isTeacher)} />
                </div>
            </div>
            {/each}
        </div>
    </div>
</main>