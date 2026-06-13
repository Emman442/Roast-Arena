# RoastArena

**Roast. Compete. Earn.**

RoastArena is an AI-powered competitive creator platform where founders create roast challenges backed by real GEN prize pools, creators submit their funniest and most savage roasts, and GenLayer Intelligent Contracts judge every submission through AI consensus before automatically rewarding the winners.

---

## The Problem

Creative competitions are everywhere in Web3.

Projects run content contests, meme campaigns, writing competitions, and bounty programs. Creators spend hours producing work, only for winners to be selected by a founder, community manager, or small judging committee.

The process is often:

* Subjective
* Opaque
* Difficult to verify
* Vulnerable to favoritism

Participants rarely know why one submission won over another.

RoastArena explores a different model.

Instead of relying on human judges, challenges are evaluated by GenLayer Intelligent Contracts using AI consensus. Every submission is scored against transparent criteria, every result is reproducible, and rewards are distributed automatically.

---

## How It Works

1. A founder creates a roast challenge and deposits GEN into the prize pool.
2. Creators submit roast entries before the challenge deadline.
3. Once the challenge ends, the founder triggers AI judging.
4. GenLayer validators independently evaluate every roast.
5. Consensus is formed on the scores.
6. Winners are ranked automatically.
7. Prize pool rewards are distributed to the top performers.

---

## AI Judging Criteria

Every roast receives a score from 0 to 100 across five dimensions.

| Category    | Weight | Description                                    |
| ----------- | ------ | ---------------------------------------------- |
| Humor       | 30%    | How funny and entertaining the roast is        |
| Creativity  | 20%    | How clever and imaginative the approach is     |
| Originality | 20%    | How unique and unexpected the roast feels      |
| Savagery    | 20%    | How hard the roast lands                       |
| Relevance   | 10%    | How closely it relates to the challenge prompt |

Final score:

Overall = (Humor × 0.3) + (Creativity × 0.2) + (Originality × 0.2) + (Savagery × 0.2) + (Relevance × 0.1)

The AI also generates reasoning explaining each score.

---

## Why Roasts?

Humor is one of the hardest things for AI to evaluate.

A good roast requires:

* Context awareness
* Creativity
* Timing
* Originality
* Understanding of culture and language

If GenLayer can reach consensus on something as subjective as comedy, it demonstrates the potential for decentralized AI evaluation across many other forms of creative work.

RoastArena is therefore both a game and a proof-of-concept for trustless creative judging.

---

## Key Features

### Founder Challenges

Founders can:

* Create roast battles
* Define challenge prompts
* Fund prize pools using GEN
* Review submissions
* Trigger AI judging after the deadline

### Creator Profiles

Creators can:

* Register unique usernames
* Build reputation
* Track participation history
* Compete for rewards

### AI Consensus Judging

Roasts are evaluated using:

* Multi-validator AI consensus
* Transparent scoring
* On-chain reasoning
* Automatic ranking

### Automated Rewards

Prize pools are distributed automatically to the highest-scoring participants.

---

## Tech Stack

### Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* TanStack Query
* Privy

### Backend

* GenLayer Intelligent Contracts
* Python

### AI Layer

* GenLayer AI Consensus
* Equivalence Principle
* Multi-validator evaluation

---

## Architecture

```text
┌────────────────────────────┐
│        Frontend            │
│                            │
│  Next.js + TypeScript      │
│  Challenge Creation        │
│  Roast Submission          │
│  Leaderboards              │
└──────────────┬─────────────┘
               │
               ▼
┌────────────────────────────┐
│      GenLayer IC           │
│                            │
│  Creator Registry          │
│  Challenge Management      │
│  GEN Escrow                │
│  AI Judging                │
│  Reward Distribution       │
└────────────────────────────┘
```

---

## Repository Structure

```text
roast-arena/
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── utils/
│
├── contract.py
│
└── README.md
```

---

## Getting Started

### Prerequisites

* Node.js 18+
* GenLayer Studio account
* GEN testnet funds

### Installation

```bash
git clone https://github.com/Emman442/roast-arena
cd roast-arena
npm install
```

### Configure Environment

```bash
cp .env.example .env
```

Add:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=<your_genlayer_contract_address>
```

### Run Frontend

```bash
npm run dev
```

### Deploy Intelligent Contract

Deploy the RoastArena Intelligent Contract through GenLayer Studio.

---

## Future Roadmap

* AI-generated roast feedback
* Creator reputation system
* Hall of Fame leaderboard
* Sponsored founder challenges
* Multi-category creative competitions
* Cross-chain prize pools
* Stablecoin rewards

---

## Built For

GenLayer Hackathon

Demonstrating how AI consensus can be used to evaluate subjective creative work fairly and transparently.

---

## Team

Emmanuel Ndema

* GitHub: https://github.com/Emman442
* Twitter/X: https://twitter.com/EmmanuelNdema1
