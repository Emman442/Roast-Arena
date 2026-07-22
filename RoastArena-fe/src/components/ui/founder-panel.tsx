import React from 'react'
import { Card, CardContent, CardHeader } from './card'
import { Challenge } from '@/lib/contracts/types'
import { BattleButton } from './battle-button'
import { useJudgeChallenge } from '@/hooks/RoastArena'
import {
    Trophy,
    Medal,
    Crown,
    Star,
} from "lucide-react"
import toast from '@/lib/utils/toast'

export default function FounderPanel({ challenge, isFounder, hasEnded }: { challenge: Challenge, isFounder: boolean, hasEnded: boolean }) {
    console.log(challenge)
    const { isPending: isJudgingChallenge, mutate: JudgeChallenge } = useJudgeChallenge()
    const sortedScores = [...(challenge.scores || [])].sort(
        (a, b) => a.rank - b.rank
    )
    const first = sortedScores[0]
    const second = sortedScores[1]
    const third = sortedScores[2]
    const handleJudgeRoasts = () => {

        try {
            JudgeChallenge({ challenge_id: challenge.challenge_id }, {
                onSuccess: () => {
                    toast.success("Roast Judgement Successful", {
                        description: "Roast Challenge results are out!",
                    })
                },
                onError: (error) => {
                    console.error("Error judging roasts:", error)
                    toast.error("Failed to judge roasts. Please try again.")
                }
            })
        } catch (error) {
            console.error("Error judgingg roast:", error)
            toast.error("Failed to judging roast. Please try again.")
        }
    }
    return (
        <>
            {
                challenge?.status === "completed" ?
                    <div className="space-y-8 w-[80%] mx-auto">

                        {/* TOP 3 PODIUM */}

                        <Card className="glass border-gold/30 overflow-hidden">
                            <CardHeader className="text-center">
                                <h2 className="text-3xl font-black italic uppercase">
                                    🏆 Final Results
                                </h2>
                            </CardHeader>

                            <CardContent>

                                <div className="grid md:grid-cols-3 gap-6">

                                    {/* SECOND */}

                                    {second && (
                                        <div className="rounded-xl border border-slate-500/30 p-6 text-center bg-slate-500/10">
                                            <Medal className="w-10 h-10 mx-auto mb-3 text-slate-300" />

                                            <div className="text-xl font-black">
                                                2nd Place
                                            </div>

                                            <div className="text-sm text-muted-foreground">
                                                {second.creator.slice(0, 6)}...
                                                {second.creator.slice(-4)}
                                            </div>

                                            <div className="mt-4 text-4xl font-black">
                                                {second.overall}
                                            </div>

                                            <div className="text-xs uppercase">
                                                Score
                                            </div>

                                            <div className="mt-4 font-bold">
                                                {second.roast}
                                            </div>
                                        </div>
                                    )}

                                    {/* FIRST */}

                                    {first && (
                                        <div className="rounded-xl border border-yellow-500 p-8 text-center bg-yellow-500/10 scale-105 shadow-xl">

                                            <Crown className="w-14 h-14 mx-auto mb-4 text-yellow-400" />

                                            <div className="text-2xl font-black">
                                                Champion
                                            </div>

                                            <div className="text-sm text-muted-foreground">
                                                {first.creator.slice(0, 6)}...
                                                {first.creator.slice(-4)}
                                            </div>

                                            <div className="mt-4 text-6xl font-black text-yellow-400">
                                                {first.overall}
                                            </div>

                                            <div className="uppercase text-xs">
                                                Winning Score
                                            </div>

                                            <div className="mt-4 font-bold">
                                                {first.roast}
                                            </div>
                                        </div>
                                    )}

                                    {/* THIRD */}

                                    {third && (
                                        <div className="rounded-xl border border-amber-700/40 p-6 text-center bg-amber-700/10">
                                            <Trophy className="w-10 h-10 mx-auto mb-3 text-amber-500" />

                                            <div className="text-xl font-black">
                                                3rd Place
                                            </div>

                                            <div className="text-sm text-muted-foreground">
                                                {third.creator.slice(0, 6)}...
                                                {third.creator.slice(-4)}
                                            </div>

                                            <div className="mt-4 text-4xl font-black">
                                                {third.overall}
                                            </div>

                                            <div className="text-xs uppercase">
                                                Score
                                            </div>

                                            <div className="mt-4 font-bold">
                                                {third.roast}
                                            </div>
                                        </div>
                                    )}

                                </div>

                            </CardContent>
                        </Card>

                        {/* FULL LEADERBOARD */}

                        <Card className="glass border-primary/20">
                            <CardHeader>
                                <h3 className="font-black text-xl uppercase italic">
                                    Full Leaderboard
                                </h3>
                            </CardHeader>

                            <CardContent className="space-y-4">

                                {sortedScores.map((score, index) => (
                                    <div
                                        key={score.creator}
                                        className="p-5 rounded-xl border border-white/10 bg-black/20"
                                    >
                                        <div className="flex justify-between items-center">

                                            <div>
                                                <div className="font-black text-lg">
                                                    #{index + 1}
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    {score.creator.slice(0, 6)}...
                                                    {score.creator.slice(-4)}
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-3xl font-black text-primary">
                                                    {score.overall}
                                                </div>

                                                <div className="text-xs uppercase">
                                                    Score
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 italic text-muted-foreground">
                                            "{score.roast}"
                                        </div>
                                    </div>
                                ))}

                            </CardContent>
                        </Card>

                    </div>

                    :


                    <div className='mb-10 w-[80%] mx-auto'>
                        <Card className=' glass border-primary/30 relative overflow-hidden group'>
                            <CardHeader className='text-center font-black uppercase tracking-tighter text-xl italic'>
                                Roast Submissions
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {Object.entries(challenge.roasts || {}).map(
                                    ([wallet, roast], index) => (
                                        <div
                                            key={wallet}
                                            className="p-4 rounded-lg border border-white/10 bg-black/20"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold">
                                                    Fighter #{index + 1}
                                                </span>

                                                <span className="text-xs text-muted-foreground">
                                                    {wallet.slice(0, 6)}...
                                                    {wallet.slice(-4)}
                                                </span>
                                            </div>

                                            <p>{roast}</p>
                                        </div>
                                    )
                                )}
                            </CardContent>

                            <BattleButton
                                onClick={handleJudgeRoasts}
                                disabled={!hasEnded || challenge.status !== "active" || isJudgingChallenge}
                                className='mx-auto block my-4'

                            >
                                {isJudgingChallenge ? "Judging..." : "Judge Roasts"}
                            </BattleButton>
                        </Card>
                    </div>
            }


        </>

    )
}
