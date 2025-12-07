"use client"

/**
 * ============================================================================
 * COMMUNITY PREDICTION POLLS - UI COMPONENT
 * ============================================================================
 * 
 * User interface for the Prediction Polls system
 * 
 * Features:
 * - Create new polls
 * - Vote YES/NO
 * - View results with progress bar
 * - Load poll by ID
 * 
 * ============================================================================
 */

import { useState } from "react"
import { useCurrentAccount } from "@iota/dapp-kit"
import { useContract } from "@/hooks/useContract"
import { usePollList } from "@/hooks/usePollList"
import { Button, Container, Flex, Heading, Text, TextField, TextArea, Card, Box, Badge, Progress, ScrollArea } from "@radix-ui/themes"
import ClipLoader from "react-spinners/ClipLoader"

const PredictionPolls = () => {
  const currentAccount = useCurrentAccount()
  const { 
    data, 
    actions, 
    state, 
    pollId, 
    isCreator, 
    pollExists, 
    hasValidData,
    yesPercentage,
    noPercentage 
  } = useContract()
  
  const { polls, isLoading: isLoadingPolls, refetch: refetchPolls } = usePollList()
  
  const isConnected = !!currentAccount

  // Form states
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loadPollId, setLoadPollId] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showPollList, setShowPollList] = useState(false)

  // Handle create poll
  const handleCreatePoll = async () => {
    if (!title.trim()) return
    await actions.createPoll(title.trim(), description.trim())
    setTitle("")
    setDescription("")
    setShowCreateForm(false)
    // Refetch polls after creating
    setTimeout(() => refetchPolls(), 2000)
  }

  // Handle load poll
  const handleLoadPoll = () => {
    if (!loadPollId.trim()) return
    actions.loadPoll(loadPollId.trim())
    setLoadPollId("")
  }

  // Handle load poll from list
  const handleLoadPollFromList = (pollId: string) => {
    actions.loadPoll(pollId)
    setShowPollList(false)
  }

  if (!isConnected) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "1rem",
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0d9488 100%)"
      }}>
        <Card style={{ maxWidth: "500px", width: "100%", padding: "2rem", textAlign: "center" }}>
          <Heading size="7" style={{ marginBottom: "1rem" }}>🗳️ Community Prediction Polls</Heading>
          <Text size="3" style={{ color: "var(--gray-11)" }}>
            Yes/No predictions with simple stats
          </Text>
          <Box style={{ marginTop: "2rem", padding: "1rem", background: "var(--blue-a3)", borderRadius: "8px" }}>
            <Text>Please connect your wallet to interact with the app.</Text>
          </Box>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      padding: "2rem", 
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0d9488 100%)"
    }}>
      <Container style={{ maxWidth: "700px", margin: "0 auto" }}>
        {/* Header */}
        <Card style={{ marginBottom: "1.5rem", padding: "1.5rem", textAlign: "center" }}>
          <Heading size="7" style={{ marginBottom: "0.5rem" }}>🗳️ Community Prediction Polls</Heading>
          <Text size="2" style={{ color: "var(--gray-11)" }}>
            Create and vote on Yes/No predictions
          </Text>
        </Card>

        {/* Actions Bar */}
        {!pollId && (
          <Card style={{ marginBottom: "1.5rem", padding: "1.5rem" }}>
            <Flex gap="3" direction="column">
              {/* Create Poll Toggle */}
              {!showCreateForm && !showPollList ? (
                <Flex gap="3" wrap="wrap" direction="column">
                  <Button 
                    size="3" 
                    onClick={() => setShowCreateForm(true)}
                  >
                    ➕ Create New Poll
                  </Button>
                  <Button 
                    size="3" 
                    variant="soft"
                    onClick={() => setShowPollList(true)}
                  >
                    📋 Browse All Polls
                  </Button>
                </Flex>
              ) : (
                <Box>
                  <Heading size="4" style={{ marginBottom: "1rem" }}>Create New Poll</Heading>
                  <Flex direction="column" gap="3">
                    <Box>
                      <Text size="2" style={{ marginBottom: "0.5rem", display: "block" }}>Title *</Text>
                      <TextField.Root
                        placeholder="E.g.: Will Bitcoin reach 100k USD in 2025?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </Box>
                    <Box>
                      <Text size="2" style={{ marginBottom: "0.5rem", display: "block" }}>Description</Text>
                      <TextArea
                        placeholder="Detailed description of the prediction..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                      />
                    </Box>
                    <Flex gap="2">
                      <Button 
                        size="2" 
                        onClick={handleCreatePoll}
                        disabled={!title.trim() || state.isPending}
                      >
                        {state.isPending ? <ClipLoader size={16} /> : "Create Poll"}
                      </Button>
                      <Button 
                        size="2" 
                        variant="soft" 
                        onClick={() => {
                          setShowCreateForm(false)
                          setTitle("")
                          setDescription("")
                        }}
                      >
                        Cancel
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
              ) : showPollList ? (
                <Box>
                  <Flex justify="between" align="center" style={{ marginBottom: "1rem" }}>
                    <Heading size="4">All Polls ({polls.length})</Heading>
                    <Button 
                      size="1" 
                      variant="ghost" 
                      onClick={() => setShowPollList(false)}
                    >
                      ✕
                    </Button>
                  </Flex>
                  
                  {isLoadingPolls ? (
                    <Flex align="center" justify="center" style={{ padding: "2rem" }}>
                      <ClipLoader size={30} />
                      <Text style={{ marginLeft: "0.5rem" }}>Loading polls...</Text>
                    </Flex>
                  ) : polls.length === 0 ? (
                    <Box style={{ 
                      padding: "2rem", 
                      textAlign: "center", 
                      background: "var(--gray-a2)", 
                      borderRadius: "8px" 
                    }}>
                      <Text>No polls found. Create the first one!</Text>
                    </Box>
                  ) : (
                    <ScrollArea style={{ maxHeight: "400px" }}>
                      <Flex direction="column" gap="2">
                        {polls.map((poll) => (
                          <Card 
                            key={poll.pollId} 
                            style={{ 
                              padding: "1rem", 
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onClick={() => handleLoadPollFromList(poll.pollId)}
                          >
                            <Flex direction="column" gap="1">
                              <Heading size="3">{poll.title}</Heading>
                              {poll.description && (
                                <Text size="2" style={{ color: "var(--gray-11)" }}>
                                  {poll.description.length > 80 
                                    ? poll.description.substring(0, 80) + "..." 
                                    : poll.description}
                                </Text>
                              )}
                              <Text size="1" style={{ color: "var(--gray-a11)", marginTop: "0.5rem" }}>
                                ID: {poll.pollId.substring(0, 10)}...
                              </Text>
                            </Flex>
                          </Card>
                        ))}
                      </Flex>
                    </ScrollArea>
                  )}
                </Box>
              )}

              {/* Divider */}
              {!showCreateForm && !showPollList && (
                <>
                  <Box style={{ 
                    borderTop: "1px solid var(--gray-a5)", 
                    margin: "0.5rem 0",
                    position: "relative" 
                  }}>
                    <Text 
                      size="1" 
                      style={{ 
                        position: "absolute", 
                        top: "-10px", 
                        left: "50%", 
                        transform: "translateX(-50%)",
                        background: "var(--color-panel)",
                        padding: "0 0.5rem",
                        color: "var(--gray-a11)"
                      }}
                    >
                      or
                    </Text>
                  </Box>

                  {/* Load Poll */}
                  <Box>
                    <Text size="2" style={{ marginBottom: "0.5rem", display: "block" }}>Load Poll by ID</Text>
                    <Flex gap="2">
                      <TextField.Root
                        placeholder="Enter Poll ID (0x...)"
                        value={loadPollId}
                        onChange={(e) => setLoadPollId(e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <Button 
                        size="2" 
                        variant="soft"
                        onClick={handleLoadPoll}
                        disabled={!loadPollId.trim()}
                      >
                        Load
                      </Button>
                    </Flex>
                  </Box>
                </>
              )}
            </Flex>
          </Card>
        )}

        {/* Poll Display */}
        {pollId && (
          <Card style={{ padding: "1.5rem" }}>
            {state.isLoading && !data ? (
              <Flex align="center" justify="center" style={{ padding: "3rem" }}>
                <ClipLoader size={40} color="#667eea" />
                <Text style={{ marginLeft: "1rem" }}>Loading poll...</Text>
              </Flex>
            ) : state.error && !data ? (
              <Box style={{ textAlign: "center" }}>
                <Box style={{ 
                  padding: "1rem", 
                  background: "var(--red-a3)", 
                  borderRadius: "8px",
                  marginBottom: "1rem"
                }}>
                  <Text style={{ color: "var(--red-11)" }}>
                    ❌ Failed to load poll
                  </Text>
                  <Text size="2" style={{ display: "block", marginTop: "0.5rem", color: "var(--red-9)" }}>
                    {state.error.message}
                  </Text>
                </Box>
                <Button variant="soft" onClick={actions.clearPoll}>
                  ← Go Back
                </Button>
              </Box>
            ) : pollExists && !hasValidData ? (
              <Box style={{ 
                padding: "1rem", 
                background: "var(--yellow-a3)", 
                borderRadius: "8px",
                textAlign: "center"
              }}>
                <Text style={{ color: "var(--yellow-11)" }}>
                  ⚠️ Poll exists but data structure is invalid
                </Text>
                <Button 
                  variant="soft" 
                  onClick={actions.clearPoll}
                  style={{ marginTop: "1rem" }}
                >
                  ← Go Back
                </Button>
              </Box>
            ) : data ? (
              <Box>
                {/* Poll Header */}
                <Flex justify="between" align="start" style={{ marginBottom: "1rem" }}>
                  <Box style={{ flex: 1 }}>
                    <Heading size="5" style={{ marginBottom: "0.5rem" }}>
                      {data.title}
                    </Heading>
                    {data.description && (
                      <Text size="2" style={{ color: "var(--gray-11)" }}>
                        {data.description}
                      </Text>
                    )}
                  </Box>
                  <Flex gap="2">
                    {isCreator && (
                      <Badge color="purple">Creator</Badge>
                    )}
                    <Badge color="blue">{data.totalVotes} votes</Badge>
                  </Flex>
                </Flex>

                {/* Results */}
                <Box style={{ 
                  padding: "1.5rem", 
                  background: "var(--gray-a2)", 
                  borderRadius: "12px",
                  marginBottom: "1.5rem"
                }}>
                  {/* YES Bar */}
                  <Flex align="center" gap="3" style={{ marginBottom: "1rem" }}>
                    <Text style={{ width: "60px", fontWeight: "bold", color: "#22c55e" }}>
                      ✓ YES
                    </Text>
                    <Box style={{ flex: 1 }}>
                      <Box style={{ 
                        height: "30px", 
                        background: "var(--gray-a4)", 
                        borderRadius: "15px",
                        overflow: "hidden",
                        position: "relative"
                      }}>
                        <Box style={{ 
                          height: "100%", 
                          width: `${yesPercentage}%`,
                          background: "linear-gradient(90deg, #22c55e, #16a34a)",
                          borderRadius: "15px",
                          transition: "width 0.5s ease"
                        }} />
                        <Text style={{ 
                          position: "absolute", 
                          right: "10px", 
                          top: "50%", 
                          transform: "translateY(-50%)",
                          fontWeight: "bold",
                          fontSize: "14px"
                        }}>
                          {yesPercentage}%
                        </Text>
                      </Box>
                    </Box>
                    <Text style={{ width: "50px", textAlign: "right" }}>
                      {data.yesCount}
                    </Text>
                  </Flex>

                  {/* NO Bar */}
                  <Flex align="center" gap="3">
                    <Text style={{ width: "60px", fontWeight: "bold", color: "#ef4444" }}>
                      ✗ NO
                    </Text>
                    <Box style={{ flex: 1 }}>
                      <Box style={{ 
                        height: "30px", 
                        background: "var(--gray-a4)", 
                        borderRadius: "15px",
                        overflow: "hidden",
                        position: "relative"
                      }}>
                        <Box style={{ 
                          height: "100%", 
                          width: `${noPercentage}%`,
                          background: "linear-gradient(90deg, #ef4444, #dc2626)",
                          borderRadius: "15px",
                          transition: "width 0.5s ease"
                        }} />
                        <Text style={{ 
                          position: "absolute", 
                          right: "10px", 
                          top: "50%", 
                          transform: "translateY(-50%)",
                          fontWeight: "bold",
                          fontSize: "14px"
                        }}>
                          {noPercentage}%
                        </Text>
                      </Box>
                    </Box>
                    <Text style={{ width: "50px", textAlign: "right" }}>
                      {data.noCount}
                    </Text>
                  </Flex>
                </Box>

                {/* Vote Buttons */}
                {isCreator ? (
                  <Box style={{ 
                    padding: "1rem", 
                    background: "var(--purple-a3)", 
                    borderRadius: "8px",
                    textAlign: "center"
                  }}>
                    <Text size="2" style={{ color: "var(--purple-11)" }}>
                      👤 You are the creator of this poll and cannot vote.
                    </Text>
                  </Box>
                ) : (
                  <Flex gap="3" justify="center">
                    <Button 
                      size="3"
                      onClick={actions.voteYes}
                      disabled={state.isLoading || state.isPending}
                      style={{ 
                        minWidth: "120px",
                        background: "linear-gradient(135deg, #22c55e, #16a34a)"
                      }}
                    >
                      {state.isPending ? (
                        <ClipLoader size={16} color="white" />
                      ) : (
                        "👍 Vote YES"
                      )}
                    </Button>
                    <Button 
                      size="3"
                      onClick={actions.voteNo}
                      disabled={state.isLoading || state.isPending}
                      style={{ 
                        minWidth: "120px",
                        background: "linear-gradient(135deg, #ef4444, #dc2626)"
                      }}
                    >
                      {state.isPending ? (
                        <ClipLoader size={16} color="white" />
                      ) : (
                        "👎 Vote NO"
                      )}
                    </Button>
                  </Flex>
                )}

                {/* Transaction Info */}
                {state.hash && (
                  <Box style={{ 
                    marginTop: "1rem", 
                    padding: "1rem", 
                    background: "var(--green-a3)", 
                    borderRadius: "8px" 
                  }}>
                    <Text size="2" style={{ display: "block", marginBottom: "0.5rem", color: "var(--green-11)" }}>
                      ✓ Transaction successful!
                    </Text>
                    <Text size="1" style={{ fontFamily: "monospace", wordBreak: "break-all" }}>
                      {state.hash}
                    </Text>
                  </Box>
                )}

                {/* Error Display */}
                {state.error && (
                  <Box style={{ 
                    marginTop: "1rem", 
                    padding: "1rem", 
                    background: "var(--red-a3)", 
                    borderRadius: "8px" 
                  }}>
                    <Text style={{ color: "var(--red-11)" }}>
                      ❌ Error: {state.error.message}
                    </Text>
                  </Box>
                )}

                {/* Poll Info */}
                <Box style={{ 
                  marginTop: "1.5rem", 
                  padding: "1rem", 
                  background: "var(--gray-a3)", 
                  borderRadius: "8px" 
                }}>
                  <Text size="1" style={{ display: "block", color: "var(--gray-a11)" }}>
                    Poll ID: <span style={{ fontFamily: "monospace" }}>{pollId}</span>
                  </Text>
                  <Text size="1" style={{ display: "block", color: "var(--gray-a11)", marginTop: "0.25rem" }}>
                    Creator: <span style={{ fontFamily: "monospace" }}>{data.creator.slice(0, 10)}...{data.creator.slice(-8)}</span>
                  </Text>
                </Box>

                {/* Back Button */}
                <Flex justify="center" style={{ marginTop: "1.5rem" }}>
                  <Button variant="soft" onClick={actions.clearPoll}>
                    ← Create/Load Another Poll
                  </Button>
                </Flex>
              </Box>
            ) : (
              <Box style={{ textAlign: "center" }}>
                <Text>Poll not found</Text>
                <Button 
                  variant="soft" 
                  onClick={actions.clearPoll}
                  style={{ marginTop: "1rem" }}
                >
                  ← Go Back
                </Button>
              </Box>
            )}
          </Card>
        )}

        {/* Footer */}
        <Box style={{ marginTop: "2rem", textAlign: "center" }}>
          <Text size="1" style={{ color: "rgba(255,255,255,0.7)" }}>
            Powered by IOTA Move Smart Contracts
          </Text>
        </Box>
      </Container>
    </div>
  )
}

export default PredictionPolls
