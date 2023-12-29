<script lang='ts'>
    import type { slug } from "./+page";
    import { appwriteDatabases,appwriteClient } from "$lib/appwrite";
    import { DB_ID,COLLECTION } from "$lib/ids";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";

    export let data:slug;

    let className = '';
    let classStudents = [] as any[];

    async function getClass() {
        await appwriteDatabases.getDocument(DB_ID,COLLECTION.Class,data.classID).then((res) => {
            // console.log(res);
            classStudents = res['students'];
            className = res['Name'];
            console.log(classStudents);
        }).catch((err) => {
            console.log(err);
        });
    }

    getClass();

    
        
    const unsubscribe = browser ? appwriteClient.subscribe('databases.'+DB_ID+'.collections.'+COLLECTION.Parents+'.documents', res => {
        // console.log('update');
        // console.log(res);
        console.log(classStudents);
        const payload = res.payload as any;
        classStudents.find((child) => child.parents.$id == payload.$id).parents.Arrived = payload.Arrived;
        // refresh the array
        classStudents = [...classStudents];
    }) : undefined;

    onMount(() => {
        return () => {
            unsubscribe!();
        };
    });


    async function isSent(e:any) {
        await appwriteDatabases.updateDocument(DB_ID,COLLECTION.Students,e.target.value,
            {
                Sent:e.target.checked
            }
        ).then((res) => {
            // console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    }
</script>

<main>
    <div class="flex flex-row justify-evenly items-center bg-base rounded-lg p-3">
        <a href="/dashboard/teacherDash"><button class="btn btn-error">Back</button></a>
        <h1 class="text-3xl font-bold text-center">{className}</h1>
    </div>
    <div class="flex flex-col items-center justify-center">
        <div class="flex flex-col gap-3 w-full">
            <div class="flex flex-row pb-2">
                <div class="flex-1 pl-2 flex flex-row gap-2">
                    <h1 class="font-bold">Arrived</h1>
                    <h1 class="font-bold">Name</h1>
                </div>
                <div class="flex flex-row gap-3 pr-4">
                    <!-- <button class="btn btn-success">Arrived</button> -->
                    <p class="font-bold">Sent</p>
                </div>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-3">
        {#each classStudents as student}
        <div class="flex flex-row p-3">
            <div class="flex-1 flex flex-row gap-4">
                <input type="checkbox" class="checkbox checkbox-success rounded-full disabled:opacity-100 disabled:bg-transparent outline" checked={student.parents.Arrived} disabled>
                <div class="flex flex-col gap-1 pl-4">
                <h2 class="text-xl">{student.Name}</h2>
                <!-- get the parents[0] Name array inside the students array -->
                <h3 class="text-sm">Parent: {student.parents.Name}</h3>
                </div>
            </div>
            <div>
                <input type="checkbox" id="{student.Name}" name="{student.Name}" value="{student.$id}" checked={student.Sent} class='checkbox checkbox-warning rounded-full' on:change={isSent}>
            </div>
        </div>
        {/each}
    </div>
</main>