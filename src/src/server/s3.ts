import AWS from 'aws-sdk';
import { env } from '~/env/server.mjs';

export const s3 = new AWS.S3({
  endpoint: 'is3.cloudhost.id',
  accessKeyId: env.S3_ACCESS_KEY,
  secretAccessKey: env.S3_SECRET_KEY,
});
