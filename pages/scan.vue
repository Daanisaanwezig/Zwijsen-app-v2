<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from '~/components/Header.vue';
import Button from '~/components/Button.vue';
import LoadingSpinner from '~/components/LoadingSpinner.vue';

const router = useRouter();
const state = ref('scanning');
const errorMessage = ref('');
const scaningState = ref('idle');
const progress = ref(0);
const video = ref(null);
const isBusy = ref(false);
let mediaStream = null;
const image = ref();
let intervalId = null;

const imageUrl = computed(() => image.value ? URL.createObjectURL(image.value) : '');
const buttonBackground = computed(() =>
    `linear-gradient(to right, var(--md-sys-color-primary) ${progress.value}%, var(--md-sys-color-secondary) ${progress.value}%)`
);

onMounted(async () => {
    mountCamera();
});

const mountCamera = async () => {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (video.value) {
            video.value.srcObject = mediaStream;
        }
    } catch (err) {
        console.error('Could not access camera:', err);
        state.value = 'error';
        errorMessage.value = 'We konden geen toegang krijgen tot je camera.';
    }
}

const startScan = async () => {
    if (!video.value) return;

    isBusy.value = true;

    const canvas = document.createElement('canvas');
    canvas.width = video.value.videoWidth;
    canvas.height = video.value.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video.value, 0, 0);
    const imageBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    image.value = imageBlob;

    scaningState.value = 'uploading';
    progress.value = 0;

    try {
        const formData = new FormData();
        formData.append('file', imageBlob, 'scan.png');

        const response = await fetch('/api/uploadToAzure', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error('Upload failed');
        const { url } = await response.json();

        scaningState.value = 'processing';
        progress.value = 0;

        await simulateProcessing();

        scaningState.value = 'success';
        state.value = 'scan-successful';
    } catch (err) {
        console.error('Error during scan process:', err);
        scaningState.value = 'error';
        errorMessage.value = 'Er is iets fout gegaan tijdens het uploaden van de afbeelding. Probeer het later opnieuw.';
        state.value = 'error';
    } finally {
        isBusy.value = false;
    }
};

const simulateProcessing = () => {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (progress.value < 100) {
                progress.value += 10;
            } else {
                clearInterval(interval);
                startAutoResetTimer();
                resolve();
            }
        }, 300);
    });
};

const startAutoResetTimer = () => {
    progress.value = 0;
    intervalId = setInterval(() => {
        if (progress.value >= 100) {
            stopAutoResetTimer();
        } else {
            progress.value += 1;
        }
    }, 50);
};

const stopAutoResetTimer = () => {
    if (intervalId) {
        clearInterval(intervalId);
    }
    resetToScanning();
};

const resetToScanning = () => {
    image.value = null;
    state.value = 'scanning';
    scaningState.value = 'idle';
    errorMessage.value = '';
    mountCamera();
};

const goToScans = () => {
    router.push('/scans');
};
</script>

<template>
    <div class="page">
        <Header :backButton="true" backTo="/" :showLogo="true">Scan</Header>
        <div class="page-content">
            <div class="scan-container">
                <div v-if="state === 'scanning'">
                    <div class="camera-container">
                        <video ref="video" autoplay playsinline></video>
                        <div class="camera-overlay" v-if="scaningState !== 'idle'">
                            <div class="camera-status">
                                <div class="status-icon" :class="scaningState"></div>
                                <p v-if="scaningState === 'uploading'" class="status-text">Uploaden...</p>
                                <p v-if="scaningState === 'processing'" class="status-text">Verwerken...</p>
                                <p v-if="scaningState === 'success'" class="status-text">Voltooid!</p>
                                <p v-if="scaningState === 'error'" class="status-text">Fout opgetreden. Probeer opnieuw.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="scan-actions">
                        <Button 
                            @click="startScan" 
                            :disabled="isBusy" 
                            type="primary"
                            fullWidth
                        >
                            <span v-if="scaningState === 'idle'">Scan maken</span>
                            <span v-else-if="scaningState === 'uploading'">Uploaden...</span>
                            <span v-else-if="scaningState === 'processing'">Verwerken...</span>
                            <span v-else>Scan maken</span>
                        </Button>
                    </div>

                    <div v-if="scaningState !== 'idle'" class="progress-container">
                        <div class="progress-bar-container">
                            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
                        </div>
                        <div class="progress-text">{{ progress }}%</div>
                    </div>
                </div>
                
                <div v-else-if="state === 'scan-successful'" class="scan-success">
                    <div class="scan-preview-container">
                        <img :src="imageUrl" alt="Gescande afbeelding" class="scan-preview">
                        <div class="scan-success-overlay">
                            <div class="success-icon">✓</div>
                        </div>
                    </div>
                    <div class="scan-actions">
                        <div class="scan-action-buttons">
                            <Button 
                                @click="stopAutoResetTimer" 
                                type="primary"
                            >
                                Volgende scan
                            </Button>
                            <Button 
                                @click="goToScans" 
                                type="secondary"
                            >
                                Bekijk alle scans
                            </Button>
                        </div>
                        <div class="auto-reset-progress">
                            <div class="progress-bar-container">
                                <div class="progress-bar" :style="{ width: progress + '%' }"></div>
                            </div>
                            <div class="progress-text">Automatisch verder in {{ Math.floor((100 - progress) / 2) }}s</div>
                        </div>
                    </div>
                </div>
                
                <div v-else class="scan-error">
                    <div class="error-icon">!</div>
                    <h3>Er is een fout opgetreden</h3>
                    <p>{{ errorMessage || 'Er is iets fout gegaan. Probeer het later opnieuw.' }}</p>
                    <div class="error-actions">
                        <Button 
                            @click="resetToScanning" 
                            type="primary"
                        >
                            Opnieuw proberen
                        </Button>
                        <Button 
                            @click="goToScans" 
                            type="light"
                        >
                            Bekijk alle scans
                        </Button>
                    </div>
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

.scan-container {
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
}

.camera-container {
    width: 100%;
    height: 70vh;
    max-height: 500px;
    border-radius: var(--radius-md);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacing-md);
    position: relative;
    background-color: #000;
    box-shadow: var(--shadow-md);
}

.camera-container video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.camera-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.camera-status {
    background-color: rgba(0, 0, 0, 0.7);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    text-align: center;
    color: #fff;
}

.status-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin: 0 auto var(--spacing-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    
    &.uploading {
        background-color: var(--md-sys-color-orange);
        &::after {
            content: "↑";
        }
    }
    
    &.processing {
        background-color: var(--md-sys-color-primary);
        &::after {
            content: "⟳";
        }
    }
    
    &.success {
        background-color: var(--md-sys-color-green);
        &::after {
            content: "✓";
        }
    }
    
    &.error {
        background-color: var(--md-sys-color-red);
        &::after {
            content: "!";
        }
    }
}

.status-text {
    margin: 0;
    font-weight: 500;
}

.scan-actions {
    margin-bottom: var(--spacing-md);
}

.scan-action-buttons {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    
    button {
        flex: 1;
    }
}

.progress-container {
    margin-bottom: var(--spacing-md);
}

.progress-bar-container {
    width: 100%;
    height: 8px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: var(--radius-pill);
    overflow: hidden;
    margin-bottom: var(--spacing-xs);
}

.progress-bar {
    height: 100%;
    background-color: var(--md-sys-color-primary);
    width: 0%;
    transition: width 0.2s ease;
}

.progress-text {
    text-align: right;
    font-size: 14px;
    color: var(--md-sys-color-on-surface);
    opacity: 0.7;
}

.scan-success {
    .scan-preview-container {
        position: relative;
        margin-bottom: var(--spacing-md);
        border-radius: var(--radius-md);
        overflow: hidden;
        box-shadow: var(--shadow-md);
    }
    
    .scan-preview {
        width: 100%;
        display: block;
    }
    
    .scan-success-overlay {
        position: absolute;
        top: 16px;
        right: 16px;
    }
    
    .success-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: var(--md-sys-color-green);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        box-shadow: var(--shadow-md);
    }
    
    .auto-reset-progress {
        margin-top: var(--spacing-sm);
    }
}

.scan-error {
    text-align: center;
    padding: var(--spacing-xl) 0;
    
    .error-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background-color: var(--md-sys-color-red);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        margin: 0 auto var(--spacing-md);
    }
    
    h3 {
        margin: 0 0 var(--spacing-sm);
        color: var(--md-sys-color-red);
    }
    
    p {
        margin-bottom: var(--spacing-lg);
        opacity: 0.7;
    }
    
    .error-actions {
        display: flex;
        gap: var(--spacing-md);
        justify-content: center;
        
        button {
            min-width: 150px;
        }
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
