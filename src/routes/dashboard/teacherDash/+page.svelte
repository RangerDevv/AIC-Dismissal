<script lang="ts">
    import { appwriteDatabases } from "$lib/appwrite";
    import { DB_ID,COLLECTION } from "$lib/ids";
    import { onMount } from "svelte";

    let classList = [] as any[];

    async function listClasses() {
        await appwriteDatabases.listDocuments(DB_ID,COLLECTION.Class).then((res) => {
            console.log(res);
            classList = res['documents'];
        }).catch((err) => {
            console.log(err);
        });
    }

    onMount(() => {
        listClasses();
    });
</script>

<main>
    <h1 class="text-3xl font-bold text-center pt-5">Classes</h1>
    <div class="flex flex-col items-center justify-center">
        <div class="flex flex-col gap-3 w-full">
            {#each classList as allClass}
            <div class="flex flex-row justify-between items-center bg-base rounded-lg p-3">
                <div class="flex flex-col">
                <h1 class="text-xl font-bold">{allClass.Name}</h1>
                <h1 class="text-sm">Teacher: {allClass.Teacher}</h1>
                </div>
                <a href="/dashboard/teacherDash/{allClass.$id}/"><button class="btn btn-primary">View</button></a>
            </div>
            {/each}
        </div>
    </div>
</main>