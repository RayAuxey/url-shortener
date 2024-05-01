import { Database } from "bun:sqlite";
import { z, type ZodError } from "zod";

const db = new Database("urls.sqlite");

await db.exec(`
  CREATE TABLE IF NOT EXISTS links (
      id VARCHAR(10) PRIMARY KEY,
      url VARCHAR(255) NOT NULL
  );
`);
interface Link {
	id: string;
	url: string;
}

interface LinkQueryResult {
	url: string;
}

const getAllLinks = db.query("SELECT * FROM links");
const addLink = db.query(
	"INSERT INTO links (id, url) VALUES (?1, ?2) ON CONFLICT(id) DO UPDATE SET url = excluded.url",
);
const deleteLink = db.query("DELETE FROM links WHERE id = ?1");
const getLink = db.query("SELECT url FROM links WHERE id = ?1");

const addLinkSchema = z.object({
	id: z.string().optional(),
	url: z.string().url(),
});
