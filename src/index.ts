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

Bun.serve({
	port: 42069,
	development: true,
});

function generateId() {
	return Math.random().toString(36).slice(2, 8); // 6 characters
}

function handler(req: Request) {
	return {
		request: req,
		searchParams: new URL(req.url).searchParams,
		lastPart: new URL(req.url).pathname.split("/").pop(),
		endpoint(
			method: Request["method"],
			pathname: URL["pathname"],
			exact = true,
		) {
			return (
				req.method === method &&
				(exact
					? new URL(req.url).pathname === pathname
					: new URL(req.url).pathname.startsWith(pathname))
			);
		},
		json(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			response: any,
			status = 200,
		) {
			return new Response(JSON.stringify(response), {
				headers: {
					"Content-Type": "application/json",
				},
				status,
			});
		},
	};
}
