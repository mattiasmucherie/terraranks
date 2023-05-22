import { db } from "@/lib/db"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" })
    return
  }

  try {
    const corporations = await db.corporation.findMany({})

    res.status(200).json({ corporations })
    return
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: "Something went wrong" })
  }
}
