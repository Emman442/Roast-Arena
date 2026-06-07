# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
from dataclasses import dataclass
from datetime import datetime, timezone
import json


@gl.evm.contract_interface
class _Recipient:
    class View:
        pass
    class Write:
        pass


# ─── Data Structures ──────────────────────────────────────────

@allow_storage
@dataclass
class Creator:
    username: str
    wallet_address: str
    total_challenges_entered: i32
    total_wins: i32
    total_earned_gen: i32
    reputation_score: i32


@allow_storage
@dataclass
class ScoredRoast:
    creator: str
    roast: str
    humor: i32
    creativity: i32
    originality: i32
    savagery: i32
    relevance: i32
    overall: i32
    reasoning: str
    rank: i32


@allow_storage
@dataclass
class Challenge:
    challenge_id: str
    founder: str
    prompt: str
    prize_pool: i32
    deadline: i64
    status: str  # "active" | "judging" | "completed" | "cancelled"
    created_at: str
    participants: DynArray[str]
    roasts: TreeMap[str, str]
    scores: DynArray[ScoredRoast]


# ─── Main Contract ────────────────────────────────────────────

class RoastArena(gl.Contract):

    # Storage
    creators: TreeMap[str, Creator]
    username_to_wallet: TreeMap[str, str]
    challenges: TreeMap[str, Challenge]
    challenge_ids: DynArray[str]
    challenge_counter: i32

    def __init__(self):
        self.challenge_counter = i32(0)

    # ─── Helpers ──────────────────────────────────────────────

    def _safe_json_parse(self, value: str) -> dict:
        cleaned = value.replace("```json", "").replace("```", "").strip()
        try:
            return json.loads(cleaned)
        except:
            return {}

    def _only_registered(self, wallet: str) -> None:
        assert wallet in self.creators, "User not registered"

    # ─── Creator Registration ─────────────────────────────────

    @gl.public.write
    def register_creator(self, username: str) -> None:
        wallet = str(gl.message.sender_address)
        assert wallet not in self.creators, "Already registered"
        assert 2 <= len(username) <= 30, "Username must be 2-30 chars"
        normalized = username.lower().strip()
        assert normalized not in self.username_to_wallet, "Username already taken"

        self.creators[wallet] = Creator(
            username=normalized,
            wallet_address=wallet,
            total_challenges_entered=i32(0),
            total_wins=i32(0),
            total_earned_gen=i32(0),
            reputation_score=i32(0)
        )
        self.username_to_wallet[normalized] = wallet

    @gl.public.write
    def update_username(self, new_username: str) -> None:
        wallet = str(gl.message.sender_address)
        assert wallet in self.creators, "Not registered"
        normalized = new_username.lower().strip()
        assert 2 <= len(normalized) <= 30, "Username must be 2-30 chars"
        assert normalized not in self.username_to_wallet, "Username already taken"
        old_username = self.creators[wallet].username
        del self.username_to_wallet[old_username]
        self.creators[wallet].username = normalized
        self.username_to_wallet[normalized] = wallet

    @gl.public.view
    def get_creator(self, identifier: str) -> Creator:
        if identifier in self.creators:
            return gl.storage.copy_to_memory(self.creators[identifier])
        if identifier in self.username_to_wallet:
            wallet = self.username_to_wallet[identifier]
            return gl.storage.copy_to_memory(self.creators[wallet])
        assert False, "Creator not found"

    @gl.public.view
    def creator_exists(self, wallet: str) -> bool:
        return wallet in self.creators

    # ─── Challenge Creation ───────────────────────────────────

    @gl.public.write.payable
    def create_challenge(
        self,
        prompt: str,
        prize_pool: i32,
        duration_seconds: i64,
        created_at: str
    ) -> str:
        founder = str(gl.message.sender_address)
        self._only_registered(founder)

        assert 10 <= len(prompt) <= 300, "Prompt must be 10-300 chars"
        assert prize_pool > 0, "Prize pool must be greater than 0"
        assert duration_seconds >= 3600, "Duration must be at least 1 hour"

        expected_value = u256(prize_pool) * u256(10**18)
        assert gl.message.value == expected_value, "Must send exact prize pool in GEN"

        self.challenge_counter += i32(1)
        challenge_id = f"roast_{self.challenge_counter}"

        self.challenges[challenge_id] = Challenge(
            challenge_id=challenge_id,
            founder=founder,
            prompt=prompt,
            prize_pool=prize_pool,
            deadline=i64(int(datetime.now(timezone.utc).timestamp() * 1000) + int(duration_seconds) * 1000),
            status="active",
            created_at=created_at,
            participants=[],
            roasts=TreeMap(),
            scores=[]
        )

        self.challenge_ids.append(challenge_id)
        return challenge_id

    @gl.public.write
    def cancel_challenge(self, challenge_id: str) -> None:
        founder = str(gl.message.sender_address)
        assert challenge_id in self.challenges, "Challenge not found"
        c = self.challenges[challenge_id]
        assert c.founder == founder, "Only founder can cancel"
        assert c.status == "active", "Challenge is not active"
        assert len(c.participants) == 0, "Cannot cancel — submissions already exist"

        self.challenges[challenge_id].status = "cancelled"

        refund = u256(c.prize_pool) * u256(10**18)
        _Recipient(Address(founder)).emit_transfer(value=refund)

    # ─── Roast Submission ─────────────────────────────────────

    @gl.public.write
    def submit_roast(
        self,
        challenge_id: str,
        roast: str
    ) -> None:
        creator = str(gl.message.sender_address)
        self._only_registered(creator)

        assert challenge_id in self.challenges, "Challenge not found"
        c = self.challenges[challenge_id]
        assert c.status == "active", "Challenge is not active"

        now = int(datetime.now(timezone.utc).timestamp() * 1000)
        assert now < int(c.deadline), "Challenge deadline has passed"
        assert creator != c.founder, "Founder cannot submit a roast"
        assert creator not in c.participants, "Already submitted a roast"
        assert 10 <= len(roast) <= 500, "Roast must be 10-500 chars"

        self.challenges[challenge_id].participants.append(creator)
        self.challenges[challenge_id].roasts[creator] = roast
        self.creators[creator].total_challenges_entered += i32(1)

    # ─── Judging ──────────────────────────────────────────────

    @gl.public.write
    def judge_challenge(self, challenge_id: str) -> None:
        triggered_by = str(gl.message.sender_address)

        assert challenge_id in self.challenges, "Challenge not found"
        c = self.challenges[challenge_id]
        assert c.status == "active", "Challenge is not active"

        now = int(datetime.now(timezone.utc).timestamp() * 1000)
        assert now >= int(c.deadline), "Challenge has not ended yet"
        assert len(c.participants) > 0, "No submissions to judge"

        self.challenges[challenge_id].status = "judging"

        prompt = c.prompt
        participants = list(c.participants)
        scores: DynArray[ScoredRoast] = []

        for creator in participants:
            roast = c.roasts[creator]

            def score_this_roast(r=roast, p=prompt) -> str:
                scoring_prompt = f"""You are an expert roast judge evaluating a submission for a competitive roast battle.

Challenge prompt: "{p}"

Roast submission: "{r}"

Score this roast on each dimension from 0 to 100:
- humor: How funny and laugh-out-loud is it?
- creativity: How original and clever is the approach?
- originality: How fresh and unexpected is the angle?
- savagery: How brutal and cutting does it land?
- relevance: How well does it address the challenge prompt?

Calculate overall as: (humor * 0.30) + (creativity * 0.20) + (originality * 0.20) + (savagery * 0.20) + (relevance * 0.10)
Round overall to the nearest integer.

Reply with ONLY this JSON, no extra text:
{{"humor":<int>,"creativity":<int>,"originality":<int>,"savagery":<int>,"relevance":<int>,"overall":<int>,"reasoning":"one sentence explaining the score"}}
"""
                result = gl.nondet.exec_prompt(scoring_prompt).strip()
                cleaned = result.replace("```json", "").replace("```", "").strip()
                try:
                    parsed = json.loads(cleaned)
                    normalized = {
                        "humor": max(0, min(100, int(parsed.get("humor", 50)))),
                        "creativity": max(0, min(100, int(parsed.get("creativity", 50)))),
                        "originality": max(0, min(100, int(parsed.get("originality", 50)))),
                        "savagery": max(0, min(100, int(parsed.get("savagery", 50)))),
                        "relevance": max(0, min(100, int(parsed.get("relevance", 50)))),
                        "overall": max(0, min(100, int(parsed.get("overall", 50)))),
                        "reasoning": str(parsed.get("reasoning", ""))
                    }
                    return json.dumps(normalized, sort_keys=True, separators=(',', ':'))
                except:
                    return json.dumps({
                        "humor": 50, "creativity": 50, "originality": 50,
                        "savagery": 50, "relevance": 50, "overall": 50,
                        "reasoning": "Could not parse score"
                    }, sort_keys=True, separators=(',', ':'))

            raw = gl.eq_principle.strict_eq(score_this_roast)

            try:
                data = json.loads(raw)
            except:
                data = {
                    "humor": 50, "creativity": 50, "originality": 50,
                    "savagery": 50, "relevance": 50, "overall": 50,
                    "reasoning": "Parse error"
                }

            scored = ScoredRoast(
                creator=creator,
                roast=roast,
                humor=i32(data.get("humor", 50)),
                creativity=i32(data.get("creativity", 50)),
                originality=i32(data.get("originality", 50)),
                savagery=i32(data.get("savagery", 50)),
                relevance=i32(data.get("relevance", 50)),
                overall=i32(data.get("overall", 50)),
                reasoning=data.get("reasoning", ""),
                rank=i32(0)
            )
            scores.append(scored)

        # Sort by overall score descending and assign ranks
        n = len(scores)
        for i in range(n - 1):
            for j in range(n - i - 1):
                if scores[j].overall < scores[j + 1].overall:
                    scores[j], scores[j + 1] = scores[j + 1], scores[j]

        for i in range(n):
            scores[i].rank = i32(i + 1)

        self.challenges[challenge_id].scores = scores
        self.challenges[challenge_id].status = "completed"

        # Distribute GEN rewards
        self._distribute_rewards(challenge_id, scores, c.prize_pool)

    # ─── Reward Distribution ──────────────────────────────────

    def _distribute_rewards(
        self,
        challenge_id: str,
        scores: DynArray[ScoredRoast],
        prize_pool: i32
    ) -> None:
        n = len(scores)
        if n == 0:
            return

        if n == 1:
            # Solo winner takes everything
            winner = scores[0].creator
            payout = u256(prize_pool) * u256(10**18)
            _Recipient(Address(winner)).emit_transfer(value=payout)
            self.creators[winner].total_wins += i32(1)
            self.creators[winner].total_earned_gen += prize_pool
            self.creators[winner].reputation_score += i32(10)

        elif n == 2:
            # 70 / 30 split
            first = scores[0].creator
            second = scores[1].creator

            payout_first = u256(prize_pool * 70 // 100) * u256(10**18)
            payout_second = u256(prize_pool * 30 // 100) * u256(10**18)

            _Recipient(Address(first)).emit_transfer(value=payout_first)
            _Recipient(Address(second)).emit_transfer(value=payout_second)

            self.creators[first].total_wins += i32(1)
            self.creators[first].total_earned_gen += i32(prize_pool * 70 // 100)
            self.creators[first].reputation_score += i32(10)
            self.creators[second].reputation_score += i32(5)

        else:
            # 60 / 25 / 15 split for top 3
            first = scores[0].creator
            second = scores[1].creator
            third = scores[2].creator

            payout_first = u256(prize_pool * 60 // 100) * u256(10**18)
            payout_second = u256(prize_pool * 25 // 100) * u256(10**18)
            payout_third = u256(prize_pool * 15 // 100) * u256(10**18)

            _Recipient(Address(first)).emit_transfer(value=payout_first)
            _Recipient(Address(second)).emit_transfer(value=payout_second)
            _Recipient(Address(third)).emit_transfer(value=payout_third)

            self.creators[first].total_wins += i32(1)
            self.creators[first].total_earned_gen += i32(prize_pool * 60 // 100)
            self.creators[first].reputation_score += i32(10)
            self.creators[second].reputation_score += i32(7)
            self.creators[third].reputation_score += i32(5)

    # ─── Read Methods ─────────────────────────────────────────

    @gl.public.view
    def get_challenge(self, challenge_id: str) -> Challenge:
        assert challenge_id in self.challenges, "Challenge not found"
        return gl.storage.copy_to_memory(self.challenges[challenge_id])

    @gl.public.view
    def get_challenge_scores(self, challenge_id: str) -> DynArray[ScoredRoast]:
        assert challenge_id in self.challenges, "Challenge not found"
        c = self.challenges[challenge_id]
        assert c.status == "completed", "Challenge not judged yet"
        return gl.storage.copy_to_memory(c.scores)

    @gl.public.view
    def get_creator_roast(self, challenge_id: str, creator: str) -> str:
        assert challenge_id in self.challenges, "Challenge not found"
        c = self.challenges[challenge_id]
        assert creator in c.participants, "Creator did not submit"
        return c.roasts[creator]

    @gl.public.view
    def fetch_all_challenges(self) -> list[Challenge]:
        result = []
        for challenge_id in self.challenge_ids:
            result.append(gl.storage.copy_to_memory(self.challenges[challenge_id]))
        return result

    @gl.public.view
    def fetch_active_challenges(self) -> list[Challenge]:
        result = []
        now = int(datetime.now(timezone.utc).timestamp() * 1000)
        for challenge_id in self.challenge_ids:
            c = self.challenges[challenge_id]
            if c.status == "active" and now < int(c.deadline):
                result.append(gl.storage.copy_to_memory(c))
        return result

    @gl.public.view
    def get_total_challenges(self) -> i32:
        return self.challenge_counter