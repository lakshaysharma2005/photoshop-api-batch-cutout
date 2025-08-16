import axios from "axios";

export async function httpGet(url: string) {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  return res.data as Buffer;
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
