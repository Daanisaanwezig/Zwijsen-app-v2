<script setup>
import Header from '~/components/Header.vue';
import Button from '~/components/Button.vue';

// Allowed states for state: "scanning", scan-successful, error (defaults to v-else)
const state = ref()
const errorMessage = ref('')
const scaningState = ref('idle');
const progress = ref(0);
const video = ref(null);
const isBusy = ref(false);
let mediaStream = null;
const image = ref();
let intervalId = null;

const imageUrl = computed(() => image.value ? URL.createObjectURL(image.value) : '');
const buttonBackground = computed(() =>
    `linear-gradient(to right, var(--color-primary) ${progress.value}%, var(--color-accent) ${progress.value}%)`
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

    // Prevent multiple clicks
    isBusy.value = true;

    // Capture a frame from the video feed
    const canvas = document.createElement('canvas');
    canvas.width = video.value.videoWidth;
    canvas.height = video.value.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video.value, 0, 0);
    const imageBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    image.value = imageBlob;

    // Begin upload
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
        errorMessage.value = 'Er is iets fout gegaan tijdens het uploaden van de afbeelding. Probeer het later opnieuw.'
        state.value = 'error';
    } finally {
        isBusy.value = false;
    }
};

// Example function to simulate server-side processing
// TODO: Replace with actual processing function
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
            // Comment out this value to style the scan complete page
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
    scaningState.value = 'idle'
    errorMessage.value = ''
    mountCamera();
};

state.value = 'scanning'
</script>
<template>
    <Header>Scan</Header>
    <div v-if="state == 'scanning'">
        <div class="camera-container">
            <video ref="video" autoplay playsinline></video>
        </div>
        <Button @click="startScan" :disabled="isBusy" :type="'primary'">
            Scan
        </Button>

        <div v-if="scaningState !== 'idle'" class="status-container">
            <p v-if="scaningState === 'uploading'">Uploading...</p>
            <p v-if="scaningState === 'processing'">Processing...</p>
            <p v-if="scaningState === 'success'">Done!</p>
            <p v-if="scaningState === 'error'">Error occurred. Please try again.</p>

            <!-- Progress Bar (only in uploading or processing) -->
            <div class="progress-bar-container" v-if="scaningState === 'uploading' || scaningState === 'processing'">
                <div class="progress-bar" :style="{ width: progress + '%' }"></div>
            </div>
        </div>

    </div>
    <div v-else-if="state == 'scan-successful'">
        <img :src="imageUrl" alt="" class="scan-preview">
        <button class="progress-button" :style="{ background: buttonBackground }" @click="stopAutoResetTimer">
            Volgende scan
        </button>
    </div>
    <div v-else class="scan-error-message">
        <template v-if="errorMessage != ''">
            <p>{{ errorMessage }}</p>
        </template>
        <template v-else>
            <p>Er is iets fout gegaan. Probeer het later opnieuw</p>
        </template>
    </div>
</template>
<style lang="scss">
.camera-container {
    width: 100%;
    height: 70vh;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
}

.camera-container video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.progress-bar-container {
    width: 80%;
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    margin-top: 8px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background-color: var(--color-secondary);
    /* A distinct purple bar */
    width: 0%;
    transition: width 0.2s ease;
}
</style>