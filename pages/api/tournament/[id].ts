import { NextApiRequest, NextApiResponse } from "next"
import { db } from "@/lib/db"

export type TournamentMatches = {
  id: string
  matchDateTime: Date
  matchResults: {
    id: string
    position: number
    player: { id: string; image: string | null; name: string | null }
  }[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { tournamentId } = req.query as { tournamentId: string }

    // Retrieve all matches for the specified tournament ID
    const matches = await db.match.findMany({
      where: { tournamentId },
      select: {
        id: true,
        matchDateTime: true,
        matchResults: {
          select: {
            id: true,
            position: true,
            player: { select: { id: true, name: true, image: true } },
          },
        },
      },
    })

    res.status(200).json(matches)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to retrieve matches" })
  }
}
