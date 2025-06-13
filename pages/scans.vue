<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Header from '~/components/Header.vue';
import Button from '~/components/Button.vue';

const images = ref<string[]>([]);
const fetchingImages = ref<boolean | 'error'>(true);
const selectedImage = ref<string | null>(null);

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

const openImagePreview = (image: string) => {
    selectedImage.value = image;
};

const closeImagePreview = () => {
    selectedImage.value = null;
};
</script>

<template>
    <div class="page">
        <Header :backButton="true" backTo="/">Scans</Header>
        <div class="page-content">
            <div class="scans-wrapper">
                <template v-if="fetchingImages === false">
                    <div v-if="images.length > 0" class="scans-container">
                        <div 
                            v-for="(image, index) in images" 
                            :key="index" 
                            class="scan-item"
                            @click="openImagePreview(image)"
                        >
                            <img :src="image" alt="Gescande afbeelding" class="scan-thumbnail">
                            <div class="scan-overlay">
                                <span class="scan-view-icon">👁️</span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="scans-empty">
                        <div class="empty-icon">📷</div>
                        <h3>Geen scans gevonden</h3>
                        <p>Je hebt nog geen scans gemaakt.</p>
                        <Button 
                            type="primary" 
                            @click="$router.push('/scan')"
                        >
                            Maak je eerste scan
                        </Button>
                    </div>
                </template>
                
                <template v-else>
                    <div class="scans-loading">
                        <template v-if="fetchingImages === 'error'">
                            <div class="error-icon">!</div>
                            <h3>Fout bij laden</h3>
                            <p>Er is iets fout gegaan tijdens het laden van de scans.</p>
                            <Button 
                                type="primary" 
                                @click="fetchingImages = true; onMounted()"
                            >
                                Opnieuw proberen
                            </Button>
                        </template>
                        <template v-else>
                            <div class="loading-spinner"></div>
                            <p>Scans aan het laden...</p>
                        </template>
                    </div>
                </template>
            </div>
        </div>
        
        <!-- Image Preview Modal -->
        <div v-if="selectedImage" class="image-preview-modal" @click="closeImagePreview">
            <div class="image-preview-content" @click.stop>
                <button class="close-button" @click="closeImagePreview">×</button>
                <img :src="selectedImage" alt="Scan preview" class="preview-image">
                <div class="preview-actions">
                    <Button type="primary">Download</Button>
                    <Button type="light">Delen</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.page-content {
    flex: 1;
    padding: var(--spacing-md);
}

.scans-wrapper {
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
}

.scans-container {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
}

.scan-item {
    width: calc(50% - (var(--spacing-md) / 2));
    position: relative;
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        
        .scan-overlay {
            opacity: 1;
        }
    }
    
    @media (min-width: 768px) {
        width: calc(33.333% - (var(--spacing-md) * 2 / 3));
    }
}

.scan-thumbnail {
    width: 100%;
    aspect-ratio: 3/4;
    object-fit: cover;
    display: block;
}

.scan-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.scan-view-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: var(--md-sys-color-primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.scans-empty, .scans-loading {
    text-align: center;
    padding: var(--spacing-xl) 0;
    
    .empty-icon, .error-icon {
        font-size: 48px;
        margin-bottom: var(--spacing-md);
    }
    
    .error-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background-color: var(--md-sys-color-red);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto var(--spacing-md);
    }
    
    h3 {
        margin: 0 0 var(--spacing-sm);
    }
    
    p {
        margin-bottom: var(--spacing-lg);
        opacity: 0.7;
    }
}

.loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: var(--md-sys-color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto var(--spacing-md);
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Image Preview Modal */
.image-preview-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--spacing-md);
}

.image-preview-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    background-color: white;
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
}

.close-button {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.7);
    }
}

.preview-image {
    max-width: 100%;
    max-height: 70vh;
    display: block;
}

.preview-actions {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: #f5f5f5;
    
    button {
        flex: 1;
    }
}
</style>
