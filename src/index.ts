import { Database } from "bun:sqlite";
import { z, type ZodError } from "zod";

const db = new Database("urls.sqlite");

await db.exec(`
  CREATE TABLE IF NOT EXISTS links (
      id VARCHAR(10) PRIMARY KEY,
      url VARCHAR(255) NOT NULL
  );
`);
