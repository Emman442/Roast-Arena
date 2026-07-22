export interface UserProfile {

  username: string
  wallet_address: string
  total_challenges_entered: string
  total_wins: number
  total_earned_gen: number
  reputation_score: number
}

export interface ScoredRoast {
    creator: string
    roast: string
    humor: number
    creativity: number
    originality: number
    savagery: number
    relevance: number
    overall: number
    reasoning: string
    rank: number  
}


export interface Challenge {
    challenge_id: string
    founder: string
    prompt: string
    founder_address: string
    project_name: string
    boss_avatar: string
    prize_pool: number
    deadline: number
    difficulty: string
    status: string  // "active" | "judging" | "completed" | "cancelled"
    created_at: string
    participants: string[]
    roasts: { [key: string]: string }
    scores: ScoredRoast[]

}


export interface TransactionReceipt {
  status: string;
  hash: string;
  blockNumber?: number;
  [key: string]: any;
}