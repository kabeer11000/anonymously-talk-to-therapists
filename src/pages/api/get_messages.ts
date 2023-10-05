// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {sql} from "@vercel/postgres";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!req.query.user_id || typeof req.query.user_id !== "string") return res.status(400).write("Include `user_id` in the query");
    const {rows} = await sql`SELECT * from CONVERSATIONS where user_id=${req.query.user_id}`;
    // Only return first row (extensibility)
    if (rows[0]) return res.json(rows[0]);
    return res.status(400).json(null);
}
