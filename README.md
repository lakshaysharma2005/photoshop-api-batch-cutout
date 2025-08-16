![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Adobe Photoshop API](https://img.shields.io/badge/Adobe-Photoshop%20API-red)
![AWS S3](https://img.shields.io/badge/AWS-S3-orange)

# photoshop-api-batch-cutout

A Node.js project integrating the Adobe Photoshop API (Firefly Services) to batch remove backgrounds from images. Supports AWS S3 with pre-signed URLs.

## Features
- Cutout endpoint (`/process/cutout`)
- Batch processing
- S3 integration (pre-signed URLs)
- Job polling with retries

## Setup
1. Get Photoshop API credentials from [Adobe Developer Console](https://developer.adobe.com/console).
2. Create an AWS S3 bucket and IAM user.
3. Copy `.env.example` → `.env` and fill values.
4. Install deps: `npm install`
5. Start server: `npm run dev`

## Usage
```bash
curl -X POST http://localhost:5050/process/cutout \
  -F 'items=[{"srcUrl":"https://example.com/image.jpg"}]'
