<script lang='ts'>
    import type { slug } from "./+page";
    import { appwriteDatabases,appwriteClient } from "$lib/appwrite";
    import { DB_ID,COLLECTION } from "$lib/ids";
    import { onMount } from "svelte";

    export let data:slug;

    let className = '';
    let classStudents = [] as any[];

    async function getClass() {
        await appwriteDatabases.getDocument(DB_ID,COLLECTION.Class,data.classID).then((res) => {
            console.log(res);
            classStudents = res['students'];
            className = res['Name'];
            console.log(classStudents);
        }).catch((err) => {
            console.log(err);
        });
    }

    getClass();

    onMount(async () => {
        
    appwriteClient.subscribe('databases.'+DB_ID+'.collections.'+COLLECTION.Parents+'.documents', async () => {
        console.log('update');
        getClass();
    });
    });
</script>

<main>
    <h1 class="text-3xl font-bold text-center pt-5">{className}</h1>
    <div class="flex flex-col gap-3">
        {#each classStudents as student}
        <div class="flex flex-row p-3">
            <div class="flex-1 flex flex-row gap-4">
                <input type="checkbox" id="{student.Name}" name="{student.Name}" value="{student.Name}" checked={student.Sent} class='checkbox checkbox-success rounded-full'>
                <div class="flex flex-col gap-1">
                <h2 class="text-xl">{student.Name}</h2>
                <!-- get the parents[0] Name array inside the students array -->
                <h3 class="text-sm">Parent: {student.parents.Name}</h3>
                </div>
            </div>
            <div>
                <input type="checkbox" class="checkbox checkbox-success rounded-full disabled:opacity-100" checked={student.parents.Arrived} disabled>
            </div>
        </div>
        {/each}
    </div>
</main>