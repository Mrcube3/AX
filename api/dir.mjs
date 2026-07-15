import { readdirSync, statSync } from "fs";
import { resolve } from "path";

export default function dir(req, res) {
  const paths = [
    "/var/task",
    "/var/task/src",
    resolve("/var/task", ".."),
    resolve("/var/task", "../.."),
    process.cwd(),
    resolve(process.cwd(), ".."),
    "/tmp",
  ];
  const result = {};
  for (const p of [...new Set(paths)]) {
    try {
      const entries = readdirSync(p);
      result[p] = entries.slice(0, 60).map(e => {
        try { const s = statSync(p + "/" + e); return e + (s.isDirectory() ? "/" : ""); }
        catch { return e; }
      });
    } catch { result[p] = null; }
  }
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify(result, null, 2));
}
