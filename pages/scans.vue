<script setup lang="ts">
import Header from '~/components/Header.vue';

const images = ref<string[]>('');
const fetchingImages = ref<boolean | 'error'>(true);

onMounted(async () => {
    try {
        const response = await fetch('/api/getFromAzure');
        if (!response.ok) throw new Error('Fetching images failed');

        const result = await response.json();
        images.value = result.images;
        fetchingImages.value = false;
    } catch (err) {
        console.error('Error during scan process:', err);
        fetchingImages.value = 'error';
    }
});
</script>
<template>
    <Header>Scans</Header>
    <div>
        <template v-if="fetchingImages == false">
            <div class="scans-container">
                <img v-for="image in images" :src="image" alt="">
            </div>
        </template>
        <template v-else>
            <template v-if="fetchingImages == 'error'">
                <p>Er is iets fout gegaan tijdens het laden van de scans</p>
            </template>
            <template v-else>
                <p>Scans aan het laden...</p>
            </template>
        </template>
    </div>
</template>
<style lang="scss">
.scans-container {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    img {
        width: calc(50% - 12px);
        outline: 1px solid var(--color-border);
    }
}
</style>