import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { s3 } from '~/server/s3';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ statusCode: 405, message: 'Method Not Allowed' });
  }

  const form = new formidable.IncomingForm({
    maxFileSize: 100 * 1024 * 1024,
    multiples: false,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json(err);
    }

    const file = files.file as formidable.File | undefined;
    if (!file) {
      return res.status(400).end('No file');
    }

    if (
      !file.mimetype?.startsWith('image/') &&
      file.mimetype !== 'application/pdf'
    ) {
      return res.status(400).end('Invalid file type');
    }

    const fileStream = fs.createReadStream(file.filepath);
    try {
      const result = await s3
        .upload({
          Bucket: 'ars',
          Key: `osjur/${Date.now()}-${file.originalFilename}`,
          Body: fileStream,
          ACL: 'public-read',
          ContentType: file.mimetype || undefined,
        })
        .promise();
      res.json(result);
    } catch (error) {
      res.status(500).json('Upload error');
    }
  });
}
