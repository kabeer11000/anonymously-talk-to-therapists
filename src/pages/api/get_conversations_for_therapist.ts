// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {sql} from "@vercel/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.query.therapist_id || typeof req.query.therapist_id !== "string")
        return res.status(400).write("Include `therapist_id` in the query");
    const {rows} = await sql`SELECT * from CONVERSATIONS where therapist_id=${req.query.therapist_id}`;
    return res.json(rows);
}
