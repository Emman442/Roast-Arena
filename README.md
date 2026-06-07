# RoastArena

**Roast. Compete. Earn.**

RoastArena is an AI-powered competitive creator platform where founders and projects post roast challenges backed by real USDC prize pools, participants submit their funniest and most savage roasts, and GenLayer Intelligent Contracts judge every submission trustlessly — distributing rewards to the top performers when the challenge ends.

---

## The Problem

Anyone who has spent time in the Web3 creator economy knows the pattern. A project posts a content bounty on Superteam Earn, Scribble, or a similar platform. Dozens of creators submit work. And then the judgment comes down to one person — a founder, a community manager, or a committee — who picks their favorites based on gut feeling, personal taste, or bias. There is no transparent scoring. There is no clear criteria. And there is definitely no way to appeal.

The result is a creator economy that talks about rewarding the best work but keeps distributing rewards the same way it always has — subjectively, opaquely, and inconsistently.

RoastArena was built as a direct response to this. The roast battle format — funny, fast, competitive — is the perfect vehicle to prove that AI can judge creative work fairly, transparently, and on-chain. Every score is visible. Every criterion is defined. Every payout is automatic.

---

## How It Works

Founders deposit USDC into a challenge contract on Base and write a roast prompt. The challenge goes live on the RoastArena platform. Creators submit their roasts before the deadline. When the challenge closes, a request is sent via LayerZero to a GenLayer Intelligent Contract, which runs each submission through an AI judge and scores it across five dimensions. The scores come back to Base, and the USDC is distributed to the top performers automatically — no human in the loop.

The flow looks like this:

```
Founder deposits USDC on Base
         ↓
Challenge goes live on RoastArena
         ↓
Creators submit roasts before deadline
         ↓
Judging triggered — LayerZero sends roasts to GenLayer
         ↓
GenLayer AI validators score each roast independently
         ↓
Consensus formed on scores
         ↓
Scores returned to Base via LayerZero
         ↓
USDC distributed to top creators automatically
```

---

## AI Judging Criteria

Each roast is scored from 0 to 100 across five categories:

| Category | Weight | What it measures |
|----------|--------|-----------------|
| Humor | 30% | How funny and laugh-out-loud the roast is |
| Creativity | 20% | How original and clever the approach is |
| Originality | 20% | How fresh and unexpected the angle is |
| Savagery | 20% | How brutal and cutting the roast lands |
| Relevance | 10% | How well it addresses the challenge prompt |

The overall score is the weighted average of all five. Every score and the AI reasoning behind it is stored on-chain and visible to everyone.

---

## Tech Stack

**Frontend**
- Next.js 15
- TypeScript
- Tailwind CSS
- TanStack Query
- Wagmi + Viem for wallet connection

**Smart Contracts**
- Solidity on Base (challenge creation, USDC escrow, reward distribution)
- Python Intelligent Contract on GenLayer (AI judging, score consensus)
- LayerZero V2 OApp for cross-chain messaging between Base and GenLayer

**AI Layer**
- GenLayer Intelligent Contracts with multi-validator AI consensus
- Each roast is judged independently by multiple validators running different LLMs
- Scores only finalize when validators reach consensus via the Equivalence Principle

---

## Architecture

```
┌─────────────────────────────────┐
│         Base Chain              │
│                                 │
│  RoastArena.sol                 │
│  - Challenge creation           │
│  - USDC escrow                  │
│  - Roast submission             │
│  - Reward distribution          │
│         ↕ LayerZero V2          │
└─────────────────────────────────┘
           ↕ cross-chain messaging
┌─────────────────────────────────┐
│         GenLayer                │
│                                 │
│  RoastArenaJudge.py             │
│  - Receives roast data          │
│  - AI scores each submission    │
│  - Validators reach consensus   │
│  - Returns scores to Base       │
└─────────────────────────────────┘
```

---

## What Makes This Different

Every existing bounty and contest platform in Web3 — Superteam Earn, Scribble, Questbook, and others — relies on human judges. That means:

- Judgment is slow
- Criteria are vague
- Results feel arbitrary
- Winners have no way to understand why they lost

RoastArena replaces the human judge with GenLayer AI consensus. The criteria are explicit and stored on-chain. The scoring is instant. The reasoning is transparent. And because multiple AI validators must agree before any score is finalized, no single model can game the result.

This is not just a product improvement. It is a new primitive for the creator economy — trustless, on-chain creative evaluation.

---

## Why Roasts

The roast format was chosen deliberately. Humor is one of the hardest creative outputs to evaluate fairly — it is inherently subjective, culturally nuanced, and easy to game with political relationships. If GenLayer AI can judge humor fairly and reach consensus on it across multiple validators, it can judge any creative work.

The inspiration came directly from watching how Web3 content contests play out on platforms like Superteam Earn and Scribble. Founders post challenges. Communities respond. And the best work does not always win — the best-connected creator does. RoastArena fixes that. The roast battle format makes it fun. GenLayer makes it fair.

---

## Repository Structure

```
roast-arena/
├── contracts/
│   ├── RoastArena.sol          # Base chain contract
│   └── RoastArenaJudge.py      # GenLayer Intelligent Contract
├── frontend/
│   ├── app/                    # Next.js app router
│   ├── components/             # UI components
│   ├── lib/
│   │   ├── contracts/          # Contract interaction classes
│   │   ├── hooks/              # React Query hooks
│   │   └── genlayer/           # GenLayer client and wallet
│   └── public/
├── relayer/
│   └── index.ts                # Off-chain LayerZero relayer service
├── deploy/
│   └── deploy.ts               # Deployment scripts
└── README.md
```

---

## Getting Started

**Prerequisites**
- Node.js 18+
- A Base Sepolia RPC URL
- A GenLayer Studio account at studio.genlayer.com
- MetaMask with Base Sepolia and GenLayer Studio networks added

**Installation**

```bash
git clone https://github.com/Emman442/roast-arena
cd roast-arena
npm install
```

**Environment setup**

```bash
cp .env.example .env
```

Fill in:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed RoastArena.sol address>
NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS=<deployed RoastArenaJudge address>
NEXT_PUBLIC_BASE_RPC_URL=<your Base Sepolia RPC>
RELAYER_PRIVATE_KEY=<relayer wallet private key>
```

**Deploy contracts**

```bash
# Deploy Solidity contract to Base Sepolia
npm run deploy:base

# Deploy Intelligent Contract to GenLayer Studio
npm run deploy:genlayer
```

**Start the relayer**

```bash
npm run relayer
```

**Start the frontend**

```bash
cd frontend && npm run dev
```

---

## Deployment

| Contract | Network | Address |
|----------|---------|---------|
| RoastArena.sol | Base Sepolia | TBD |
| RoastArenaJudge.py | GenLayer Studionet | TBD |

---

## Team

Built by Emmanuel Ndema — Web3 developer and content creator active across the Superteam and GenLayer ecosystems.

- Twitter: [@EmmanuelNdema1](https://twitter.com/EmmanuelNdema1)
- GitHub: [Emman442](https://github.com/Emman442)

---

## Built With

- [GenLayer](https://genlayer.com) — AI-native blockchain for Intelligent Contracts
- [LayerZero V2](https://layerzero.network) — Cross-chain messaging protocol
- [Base](https://base.org) — Ethereum L2 by Coinbase
- [Circle USDC](https://circle.com/usdc) — Native USDC on Base