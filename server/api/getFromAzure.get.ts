import { BlobServiceClient } from '@azure/storage-blob';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const connectionString = config.azureStorageConnectionString;
    const containerName = config.public.azureStorageContainerName;

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const imageUrls: string[] = [];

    // Async iterator to list all blobs
    for await (const blob of containerClient.listBlobsFlat()) {
        const name = blob.name.toLowerCase();
        if (imageExtensions.some(ext => name.endsWith(ext))) {
            const blobClient = containerClient.getBlockBlobClient(blob.name);
            imageUrls.push(blobClient.url);
        }
    }

    return { images: imageUrls };
});
