import { mkdir, readFile, appendFile } from "node:fs/promises";
import { join } from "node:path";

export class OrderStore {
  constructor(dataDir) {
    this.dataDir = dataDir;
    this.file = join(dataDir, "orders.jsonl");
  }

  async init() {
    await mkdir(this.dataDir, { recursive: true });
  }

  async create(order) {
    await this.init();
    await appendFile(this.file, `${JSON.stringify(order)}\n`, "utf8");
    return order;
  }

  async list() {
    await this.init();
    try {
      const text = await readFile(this.file, "utf8");
      return text
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line));
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }

  async get(id) {
    const orders = await this.list();
    return orders.find((order) => order.id === id) || null;
  }
}
