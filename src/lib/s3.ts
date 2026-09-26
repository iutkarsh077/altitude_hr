import { S3Client } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY1;
const secretAccessKey = process.env.AWS_SECRET_KEY1;

if (!region || !accessKeyId || !secretAccessKey || !process.env.AWS_BUCKET_NAME) {
    throw new Error("AWS_REGION, AWS_ACCESS_KEY1, AWS_SECRET_KEY1, and AWS_BUCKET_NAME must be configured");
}

export const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

export const s3BucketName = process.env.AWS_BUCKET_NAME;