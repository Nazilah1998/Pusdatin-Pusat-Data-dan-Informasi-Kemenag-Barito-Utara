const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function migrate() {
  const r2Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT_URL,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

  const bucketName = process.env.R2_BUCKET_PUSDATIN || 'data-pusdatin';
  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'apps');

  if (!fs.existsSync(uploadsDir)) {
    console.log('Directory does not exist:', uploadsDir);
    return;
  }

  const files = fs.readdirSync(uploadsDir);
  console.log(`Found ${files.length} files to migrate.`);

  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    const fileStat = fs.statSync(filePath);
    
    if (fileStat.isFile()) {
      const fileBuffer = fs.readFileSync(filePath);
      let contentType = 'application/octet-stream';
      if (file.endsWith('.png')) contentType = 'image/png';
      else if (file.endsWith('.svg')) contentType = 'image/svg+xml';
      else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) contentType = 'image/jpeg';
      
      const objectKey = `apps/${file}`;
      
      try {
        console.log(`Uploading ${file}...`);
        await r2Client.send(new PutObjectCommand({
          Bucket: bucketName,
          Key: objectKey,
          Body: fileBuffer,
          ContentType: contentType,
        }));
        console.log(`Successfully uploaded ${file} to ${bucketName}/${objectKey}`);
        
        // Remove file after successful upload
        fs.unlinkSync(filePath);
        console.log(`Deleted local file ${file}`);
      } catch (err) {
        console.error(`Failed to upload ${file}:`, err);
      }
    }
  }
  
  console.log('Migration complete!');
  
  // Try to remove the directories if they are empty
  try {
    fs.rmdirSync(uploadsDir);
    console.log(`Removed empty directory ${uploadsDir}`);
    fs.rmdirSync(path.join(__dirname, '..', 'public', 'uploads'));
    console.log(`Removed empty directory public/uploads`);
  } catch (err) {
    console.log('Could not remove directories (they might not be empty):', err.message);
  }
}

migrate();
