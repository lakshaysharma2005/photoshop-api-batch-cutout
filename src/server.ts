import "dotenv/config";
import express from "express";
import multer from "multer";
import path from "path";
import { presignPut, presignGet } from "./storage";
import { submitCutout, waitForJob } from "./photoshop";

const app = express();
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

app.get("/health", (_, res) => res.send({ ok: true }));

app.post("/process/cutout", upload.array("files"), async (req, res) => {
  try {
    const items = (req.body.items ? JSON.parse(req.body.items) : []) as Array<{ srcUrl?: string; filename?: string }>;
    const files = (req.files || []) as Express.Multer.File[];

    const jobs = await Promise.all(
      [...items, ...files.map(f => ({ srcUrl: undefined, filename: f.originalname }))].map(async (it, idx) => {
        const base = it.filename || `upload-${Date.now()}-${idx}.png`;
        const outputKey = `processed/${path.parse(base).name}-cutout.png`;

        const inputUrl = it.srcUrl!;
        const outputPutUrl = await presignPut(outputKey, "image/png");
        const outputGetUrl = await presignGet(outputKey);

        const statusUrl = await submitCutout({ input: inputUrl, output: outputPutUrl, format: "png" });
        const result = await waitForJob(statusUrl);

        return { input: inputUrl, output: outputGetUrl, status: result.status };
      })
    );

    res.json({ ok: true, jobs });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message || String(err) });
  }
});

const port = Number(process.env.PORT || 5050);
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
