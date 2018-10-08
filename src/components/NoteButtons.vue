<template>
    <v-card-actions>
        <v-btn flat @click="onDelete" >{{ deleteLabel }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn flat @click="openShare" v-if="canWrite">Share</v-btn>
        <v-btn flat @click="onSave" v-if="canWrite">Save</v-btn>
    </v-card-actions>
</template>

<script>
export default {
    props: ['canWrite', 'openShare', 'onSave', 'onDelete', 'deleteLabel']
}
</script>

<style>

</style>
