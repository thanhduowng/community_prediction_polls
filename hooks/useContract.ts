"use client"

/**
 * ============================================================================
 * COMMUNITY PREDICTION POLLS - CONTRACT INTEGRATION HOOK
 * ============================================================================
 * 
 * Hook tương tác với smart contract Community Prediction Polls
 * 
 * Tính năng:
 * - Tạo poll mới với title và description
 * - Vote YES hoặc NO
 * - Xem kết quả poll
 * 
 * ============================================================================
 */

import { useState, useEffect, useCallback } from "react"
import {
  useCurrentAccount,
  useIotaClient,
  useSignAndExecuteTransaction,
  useIotaClientQuery,
} from "@iota/dapp-kit"
import { Transaction } from "@iota/iota-sdk/transactions"
import { useNetworkVariable } from "@/lib/config"
import type { IotaObjectData } from "@iota/iota-sdk/client"

// ============================================================================
// CONTRACT CONFIGURATION
// ============================================================================

export const CONTRACT_MODULE = "contract"
export const CONTRACT_METHODS = {
  CREATE_POLL: "create_poll",
  VOTE: "vote",
} as const

// Vote choices
export const VOTE_YES = 0
export const VOTE_NO = 1

// ============================================================================
// DATA EXTRACTION
// ============================================================================

function getObjectFields(data: IotaObjectData): PollData | null {
  if (data.content?.dataType !== "moveObject") {
    console.log("Data is not a moveObject:", data.content?.dataType)
    return null
  }
  
  const fields = data.content.fields as any
  if (!fields) {
    console.log("No fields found in object data")
    return null
  }
  
  console.log("Object fields structure:", JSON.stringify(fields, null, 2))
  
  return {
    creator: String(fields.creator || ""),
    title: String(fields.title || ""),
    description: String(fields.description || ""),
    yesCount: parseInt(fields.yes_count || "0", 10),
    noCount: parseInt(fields.no_count || "0", 10),
    totalVotes: parseInt(fields.total_votes || "0", 10),
  }
}

// ============================================================================
// TYPES
// ============================================================================

export interface PollData {
  creator: string
  title: string
  description: string
  yesCount: number
  noCount: number
  totalVotes: number
}

export interface ContractState {
  isLoading: boolean
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  hash: string | undefined
  error: Error | null
}

export interface ContractActions {
  createPoll: (title: string, description: string) => Promise<void>
  voteYes: () => Promise<void>
  voteNo: () => Promise<void>
  clearPoll: () => void
  loadPoll: (pollId: string) => void
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export const useContract = () => {
  const currentAccount = useCurrentAccount()
  const address = currentAccount?.address
  const packageId = useNetworkVariable("packageId")
  const iotaClient = useIotaClient()
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction()
  const [pollId, setPollId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hash, setHash] = useState<string | undefined>()
  const [transactionError, setTransactionError] = useState<Error | null>(null)

  // Load poll ID from URL hash
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlHash = window.location.hash.slice(1)
      if (urlHash) setPollId(urlHash)
    }
  }, [])

  // Fetch poll data
  const { data, isPending: isFetching, error: queryError, refetch } = useIotaClientQuery(
    "getObject",
    {
      id: pollId!,
      options: { showContent: true, showOwner: true },
    },
    {
      enabled: !!pollId,
    }
  )

  // Extract fields
  const fields = data?.data ? getObjectFields(data.data) : null
  const isCreator = fields?.creator.toLowerCase() === address?.toLowerCase()
  const pollExists = !!data?.data
  const hasValidData = !!fields

  // Calculate percentages
  const yesPercentage = fields && fields.totalVotes > 0 
    ? Math.round((fields.yesCount / fields.totalVotes) * 100) 
    : 0
  const noPercentage = fields && fields.totalVotes > 0 
    ? Math.round((fields.noCount / fields.totalVotes) * 100) 
    : 0

  // Create poll
  const createPoll = useCallback(async (title: string, description: string) => {
    if (!packageId) return

    try {
      setIsLoading(true)
      setTransactionError(null)
      setHash(undefined)
      
      const tx = new Transaction()
      tx.moveCall({
        arguments: [
          tx.pure.vector("u8", Array.from(new TextEncoder().encode(title))),
          tx.pure.vector("u8", Array.from(new TextEncoder().encode(description))),
        ],
        target: `${packageId}::${CONTRACT_MODULE}::${CONTRACT_METHODS.CREATE_POLL}`,
      })

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: async ({ digest }) => {
            setHash(digest)
            try {
              const { effects } = await iotaClient.waitForTransaction({
                digest,
                options: { showEffects: true },
              })
              const newPollId = effects?.created?.[0]?.reference?.objectId
              if (newPollId) {
                setPollId(newPollId)
                if (typeof window !== "undefined") {
                  window.location.hash = newPollId
                }
                setIsLoading(false)
              } else {
                setIsLoading(false)
                console.warn("No poll ID found in transaction effects")
              }
            } catch (waitError) {
              console.error("Error waiting for transaction:", waitError)
              setIsLoading(false)
            }
          },
          onError: (err) => {
            const error = err instanceof Error ? err : new Error(String(err))
            setTransactionError(error)
            console.error("Error:", err)
            setIsLoading(false)
          },
        }
      )
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setTransactionError(error)
      console.error("Error creating poll:", err)
      setIsLoading(false)
    }
  }, [packageId, signAndExecute, iotaClient])

  // Vote helper
  const vote = useCallback(async (choice: number) => {
    if (!pollId || !packageId) return

    try {
      setIsLoading(true)
      setTransactionError(null)
      
      const tx = new Transaction()
      tx.moveCall({
        arguments: [tx.object(pollId), tx.pure.u8(choice)],
        target: `${packageId}::${CONTRACT_MODULE}::${CONTRACT_METHODS.VOTE}`,
      })

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: async ({ digest }) => {
            setHash(digest)
            await iotaClient.waitForTransaction({ digest })
            await refetch()
            setIsLoading(false)
          },
          onError: (err) => {
            const error = err instanceof Error ? err : new Error(String(err))
            setTransactionError(error)
            console.error("Error:", err)
            setIsLoading(false)
          },
        }
      )
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setTransactionError(error)
      console.error("Error voting:", err)
      setIsLoading(false)
    }
  }, [pollId, packageId, signAndExecute, iotaClient, refetch])

  const voteYes = useCallback(() => vote(VOTE_YES), [vote])
  const voteNo = useCallback(() => vote(VOTE_NO), [vote])

  const clearPoll = useCallback(() => {
    setPollId(null)
    setTransactionError(null)
    setHash(undefined)
    if (typeof window !== "undefined") {
      window.location.hash = ""
    }
  }, [])

  const loadPoll = useCallback((newPollId: string) => {
    setPollId(newPollId)
    setTransactionError(null)
    setHash(undefined)
    if (typeof window !== "undefined") {
      window.location.hash = newPollId
    }
  }, [])

  const pollData: PollData | null = fields

  const actions: ContractActions = {
    createPoll,
    voteYes,
    voteNo,
    clearPoll,
    loadPoll,
  }

  const contractState: ContractState = {
    isLoading: (isLoading && !pollId) || isPending || isFetching,
    isPending,
    isConfirming: false,
    isConfirmed: !!hash && !isLoading && !isPending,
    hash,
    error: queryError || transactionError,
  }

  return {
    data: pollData,
    actions,
    state: contractState,
    pollId,
    isCreator,
    pollExists,
    hasValidData,
    yesPercentage,
    noPercentage,
  }
}

