<script lang="ts">
    import { appwriteDatabases } from "$lib/appwrite";
    import { DB_ID,COLLECTION } from "$lib/ids";
    import { onMount } from "svelte";

    let classList = [] as any[];

    let todayDate = new Date().toISOString().slice(0,10);
    console.log(todayDate);


    async function listClasses() {
        await appwriteDatabases.listDocuments(DB_ID,COLLECTION.Class).then((res) => {
            // console.log(res);
            classList = res['documents'];
            console.log(classList);
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
            {#if classList.length === 0}
            <div class="flex flex-col justify-start items-center pt-10">
                <span class="loading loading-spinner loading-lg"></span>
            </div>
            {:else}
                {#each classList as allClass}
                <div class="flex flex-row justify-between items-center bg-base rounded-lg p-3">
                    <div class="flex flex-col">
                    <h1 class="text-xl font-bold">{allClass.Name}</h1>
                    <h1 class="text-sm">Teacher: {allClass.Teacher}</h1>
                    </div>
                    {#if allClass.students.length>0}
                    <div class="stack">
                    {#each allClass.students as student}
                    {#if student.parents.Arrived && !student.Sent && student.length !== 0}
                    <div class="indicator">
                        <span class="indicator-item badge badge-secondary">!</span>
                        <a href="/dashboard/teacherDash/{allClass.$id}/"><button class="btn btn-primary">View</button></a>
                      </div>
                    {:else}
                    <a href="/dashboard/teacherDash/{allClass.$id}/"><button class="btn btn-primary">View</button></a>
                    {/if}
                    {/each}
                    </div>
                    {:else}
                    <a href="/dashboard/teacherDash/{allClass.$id}/"><button class="btn btn-primary">View</button></a>
                    {/if}
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</main>