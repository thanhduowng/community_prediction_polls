"use client"

/**
 * ============================================================================
 * POLL LIST HOOK
 * ============================================================================
 * 
 * Hook to fetch all polls using IOTA events
 * 
 * ============================================================================
 */

import { useState, useEffect } from "react"
import { useIotaClient } from "@iota/dapp-kit"
import { useNetworkVariable } from "@/lib/config"

export interface PollListItem {
  pollId: string
  creator: string
  title: string
  description: string
}

export const usePollList = () => {
  const iotaClient = useIotaClient()
  const packageId = useNetworkVariable("packageId")
  const [polls, setPolls] = useState<PollListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const loadPolls = async () => {
    if (!packageId) return

    try {
      setIsLoading(true)
      setError(null)

      // Query PollCreated events
      const events = await iotaClient.queryEvents({
        query: {
          MoveEventType: `${packageId}::contract::PollCreated`
        },
        limit: 50,
        order: "descending"
      })

      const pollList: PollListItem[] = events.data.map((event: any) => {
        const parsedJson = event.parsedJson
        return {
          pollId: parsedJson.poll_id,
          creator: parsedJson.creator,
          title: parsedJson.title,
          description: parsedJson.description,
        }
      })

      setPolls(pollList)
      setIsLoading(false)
    } catch (err) {
      console.error("Error loading polls:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPolls()
  }, [packageId])

  return {
    polls,
    isLoading,
    error,
    refetch: loadPolls,
  }
}
