import "dotenv/config";
import { Photoshop } from "@adobe/photoshop-apis";
import axios from "axios";
import { sleep } from "./utils";

const client = new Photoshop({
  clientId: process.env.ADOBE_CLIENT_ID!,
  clientSecret: process.env.ADOBE_CLIENT_SECRET!,
  organizationId: process.env.ADOBE_ORG_ID
});

export type CutoutJob = {
  input: string;
  output: string;
  format?: "png" | "jpeg";
};

export async function submitCutout(job: CutoutJob) {
  const token = await client.getAccessToken();

  const resp = await axios.post(
    "https://image.adobe.io/sensei/cutout",
    {
      inputs: [{ href: job.input }],
      outputs: [{ href: job.output, storage: "external", type: job.format || "png" }]
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": process.env.ADOBE_CLIENT_ID!,
        "Content-Type": "application/json"
      }
    }
  );

  return resp.headers.location as string;
}

export async function waitForJob(statusUrl: string, timeoutMs = 180000) {
  const token = await client.getAccessToken();
  const start = Date.now();

  while (true) {
    const res = await axios.get(statusUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": process.env.ADOBE_CLIENT_ID!
      }
    });

    const { status } = res.data;
    if (status === "succeeded") return res.data;
    if (status === "failed") throw new Error(JSON.stringify(res.data));
    if (Date.now() - start > timeoutMs) throw new Error("Timed out waiting for job");

    await sleep(2000);
  }
}
