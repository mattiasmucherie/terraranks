import { useRouter } from "next/router"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Tournament } from "@/components/Tournament"
import { Spinner } from "@chakra-ui/react"
import { TournamentMatches } from "@/pages/api/tournament/[id]"

export default function TournamentPage() {
  const router = useRouter()
  const { id } = router.query
  const { data, isLoading } = useSWR<TournamentMatches[]>(
    `/api/tournament/${id}`,
    fetcher
  )
  if (!data || isLoading) {
    return <Spinner />
  }
  return <Tournament matches={data} />
}
