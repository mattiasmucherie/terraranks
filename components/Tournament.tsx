import { TournamentMatches } from "@/pages/api/tournament/[id]"
import { FC } from "react"
import { NewMatch } from "@/components/NewMatch"

type TournamentProps = {
  matches: TournamentMatches[]
}

export const Tournament: FC<TournamentProps> = ({ matches }) => {
  return (
    <div>
      {matches.map((m) => (
        <div key={m.id}>{new Date(m.matchDateTime).toLocaleString()}</div>
      ))}
      <NewMatch></NewMatch>
    </div>
  )
}
