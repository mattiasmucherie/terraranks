import type { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcrypt"
import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth/next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    res.status(405).json({ message: "Method not allowed" })
    return
  }
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(403).json({ message: "You need to login to join a tournament" })
    return
  }
  console.log(req.body)
  const { tournamentId, password } = JSON.parse(req.body)

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { tournaments: { select: { id: true } } },
  })

  if (!tournamentId) {
    res.status(400).json({ message: "Invalid request body" })
    return
  }
  if (user?.tournaments.some((tournament) => tournament.id === tournamentId)) {
    res.status(400).json({ message: "Already in the tournament" })
    return
  }

  const tournament = await db.tournament.findUnique({
    where: { id: tournamentId },
    select: { password: true },
  })

  if (!tournament) {
    res.status(400).json({ message: "Invalid tournament" })
    return
  }

  // Check if the passwords match
  const passwordMatch = await bcrypt.compare(password, tournament.password)
  if (!passwordMatch) {
    res.status(400).json({ message: "Invalid tournament password" })
    return
  }

  try {
    await db.tournament.update({
      where: { id: tournamentId },
      data: { players: { connect: { id: session.user.id } } },
    })
    await db.tournamentRating.create({
      data: {
        playerId: session.user.id,
        tournamentId,
      },
    })

    res.status(200).json({ message: "Added to the tournament" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to create tournament" })
  }
}
