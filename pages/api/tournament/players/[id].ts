import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" })
    return
  }
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res
      .status(403)
      .json({ message: "You need to login to create a tournament" })
    return
  }
  const { id } = req.query as { id: string }

  if (!id) {
    res.status(400).json({ message: "id is not valid" })
    return
  }
  const tournamentPlayers = await db.tournament.findUnique({
    where: { id },
    select: {
      players: true,
    },
  })

  res.status(200).json({ tournamentPlayers })
}
