import { execFile } from "node:child_process";

export function checkOnchainOS({ timeoutMs = 30000 } = {}) {
  return new Promise((resolve) => {
    const child = execFile(
      "onchainos",
      ["preflight", "--skill-version", "4.2.2"],
      { timeout: timeoutMs },
      (error, stdout, stderr) => {
        if (error) {
          resolve({
            installed: false,
            ready: false,
            status: error.code === "ENOENT" ? "missing" : "error",
            message: error.code === "ENOENT"
              ? "Onchain OS CLI is not installed."
              : (stderr || error.message).trim()
          });
          return;
        }

        let data = null;
        try {
          const jsonLine = stdout
            .split("\n")
            .map((line) => line.trim())
            .find((line) => line.startsWith("{") && line.endsWith("}"));
          data = jsonLine ? JSON.parse(jsonLine) : { raw: stdout.trim() };
        } catch {
          data = { raw: stdout.trim() };
        }
        const status = data?.data?.status || "unknown";

        resolve({
          installed: true,
          ready: status === "ok",
          status,
          message: status === "ok"
            ? "Onchain OS CLI is installed."
            : "Onchain OS CLI is installed, but preflight requires maintenance.",
          data
        });
      }
    );

    child.stdin?.end();
  });
}
