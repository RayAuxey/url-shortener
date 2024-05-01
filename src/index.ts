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
	async fetch(req) {
		const h = handler(req);
		const { endpoint, json, searchParams } = h;

		if (endpoint("POST", "/add")) {
			const body = (await req.json()) as z.infer<typeof addLinkSchema>;
			try {
				addLinkSchema.parse(body);
			} catch (error) {
				return json(
					{
						error: (error as ZodError).errors[0].message,
					},
					400,
				);
			}
			addLink.run(body.id ?? generateId(), body.url);
			return new Response("Successfully added the link!");
		}

		if (endpoint("GET", "/links")) {
			const allLinks = getAllLinks.all() as Link[];
			return json(allLinks);
		}

		if (endpoint("DELETE", "/delete")) {
			const id = searchParams.get("id");
			if (!id) {
				return json(
					{
						error: "No ID provided",
					},
					400,
				);
			}

			deleteLink.run(id);
			return new Response("Successfully deleted the link!");
		}

		const id = h.lastPart;
		if (!id) {
			return new Response("No ID provided", { status: 400 });
		}

		const link = getLink.get(id) as LinkQueryResult;

		if (!link) {
			return new Response("Not Found", { status: 404 });
		}

		return Response.redirect(link.url, 301);
	},
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
