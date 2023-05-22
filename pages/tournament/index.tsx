import { fetcher } from "@/lib/fetcher"
import useSWR from "swr"
import { Spinner, VStack } from "@chakra-ui/react"
import { TournamentAPI } from "@/pages/api/tournament"
import { TournamentCard } from "@/components/TournamentCard"

export default function Tournament() {
  const { data, error, isLoading } = useSWR<{
    tournaments: TournamentAPI
    myTournaments: TournamentAPI
  }>("/api/tournament", fetcher)
  if (!data && isLoading) {
    return <Spinner></Spinner>
  }

  return (
    <VStack minW="full">
      <TournamentCard
        tournaments={data!.myTournaments}
        title="My tournaments"
      ></TournamentCard>
      <TournamentCard
        tournaments={data!.tournaments}
        title="All tournaments"
        isJoinable
      ></TournamentCard>
    </VStack>
  )
}
