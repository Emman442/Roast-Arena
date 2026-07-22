"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { BattleButton } from "@/components/ui/battle-button"
import { Trophy, ChevronLeft, Quote, Flame, ShieldAlert, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { useFetchChallenges } from "@/hooks/RoastArena"
import { Challenge, ScoredRoast } from "@/lib/contracts/types"

export default function HallOfFamePage() {
  const { isPending: isFetchingChallenges, data: challengesData } = useFetchChallenges()
  const [displayCount, setDisplayCount] = React.useState(6)

  // ─── Data Extraction & Processing ──────────────────────────────────
  const legendaryRoasts = React.useMemo(() => {
    if (!challengesData || !Array.isArray(challengesData)) return []

    const typedChallenges = challengesData as Challenge[]
    const list: Array<ScoredRoast & { projectName: string; challengeId: string; dateStr: string }> = []

    // 1. Traverse all challenges
    typedChallenges.forEach((challenge) => {
      // Only pluck legendary roasts from completed, judged events
      if (challenge.status === "completed" && challenge.scores) {
        challenge.scores.forEach((scoreItem) => {
          // 2. Filter criteria: Overall Score strictly greater than 70
          if (scoreItem.overall > 70) {
            list.push({
              ...scoreItem,
              projectName: challenge.project_name || "Unknown Project",
              challengeId: challenge.challenge_id,
              dateStr: challenge.created_at
                ? new Date(challenge.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })
                : "ANCIENT ERA"
            })
          }
        })
      }
    })

    // 3. Sort chronologically/hierarchically by overall score descending
    return list.sort((a, b) => b.overall - a.overall)
  }, [challengesData])

  const visibleRoasts = legendaryRoasts.slice(0, displayCount)

  return (
    <div className="min-h-screen flex flex-col pt-24 bg-background selection:bg-battle-orange/30">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto w-full px-6 mb-8 flex items-center justify-between">
        <Link href="/" >
          <BattleButton variant="ghost" size="sm" className="flex items-center gap-2 group">
            <div className="flex gap-2 items-center text-sm font-bold uppercase text-primary">
              <span><ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /></span>
              <span>BACK TO ARENAS</span>
            </div>
          </BattleButton>
        </Link>
      </div>

      <section className="max-w-7xl mx-auto w-full px-6 mb-12 flex-1">
        {/* Page Header */}
        <div className="space-y-2 border-l-4 border-battle-orange pl-6 mb-12">
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">
            Hall of <span className="text-battle-orange animate-pulse">Fame</span>
          </h1>
          <p className="text-muted-foreground font-medium italic">
            The most savage, high-scoring on-chain roasts authenticated by GenLayer AI consensus.
          </p>
        </div>

        {/* Loading / Empty States */}
        {isFetchingChallenges ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 rounded-xl glass border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : legendaryRoasts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-white/10 rounded-2xl bg-black/20 max-w-2xl mx-auto mt-12">
            <ShieldAlert className="w-12 h-12 text-battle-orange/40 mb-4" />
            <h3 className="text-xl font-bold uppercase italic tracking-tight">No Legends Crowned Yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              No one has broken past an overall rating of 70 in this arena yet. Get in there and drop something devastating.
            </p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleRoasts.map((roast, index) => {
              // Format abbreviated wallet addresses smoothly
              const shortAddress = roast.creator
                ? `${roast.creator.slice(0, 6)}...${roast.creator.slice(-4)}`
                : "Anonymous"

              return (
                <Card
                  key={`${roast.challengeId}-${roast.creator}`}
                  className="glass border-battle-orange/10 overflow-hidden hover:border-battle-orange/40 transition-all duration-300 group flex flex-col justify-between relative"
                >
                  {/* Subtle top background glow based on high rankings */}
                  {index < 3 && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-battle-orange via-yellow-500 to-transparent opacity-60" />
                  )}

                  <div>
                    <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
                      <div className="flex items-center gap-3">
                        {/* Creator Block Address Identifier */}
                        <div className="flex flex-col">
                          <span className="text-sm font-black italic tracking-tight text-foreground hover:text-battle-orange transition-colors">
                            {shortAddress}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            {roast.dateStr}
                          </span>
                        </div>
                      </div>

                      {/* Overall Metric Badge */}
                      <div className="bg-battle-orange/10 px-3 py-1 rounded-md border border-battle-orange/30 flex items-center gap-1 shadow-inner">
                        <Flame className="w-3.5 h-3.5 text-battle-orange" />
                        <span className="text-sm font-black text-battle-orange italic tracking-tighter">
                          {roast.overall}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* The Actual Roast Text */}
                      <div className="relative p-5 bg-black/50 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                        <Quote className="absolute top-2 left-2 w-4 h-4 text-battle-orange/10" />
                        <p className="text-sm font-medium leading-relaxed italic text-muted-foreground group-hover:text-foreground transition-colors pl-4">
                          "{roast.roast}"
                        </p>
                      </div>

                      {/* Targeted Project / Track */}
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider py-2 px-1 bg-white/[0.02] border border-white/5 rounded-lg">
                        <span className="text-muted-foreground pl-1">Target Project:</span>
                        <span className="text-battle-orange font-black italic">{roast.projectName}</span>
                      </div>

                      {/* AI Reasoning Disclosure Accordion Style */}
                      <div className="p-3 bg-white/[0.01] rounded-lg border border-dashed border-white/5">
                        <span className="text-[9px] font-black tracking-widest text-muted-foreground block uppercase mb-1">
                          Consensus Verdict:
                        </span>
                        <p className="text-[11px] leading-relaxed text-muted-foreground/80 italic">
                          {roast.reasoning || "No reasoning documented by validators."}
                        </p>
                      </div>
                    </CardContent>
                  </div>

                  {/* Score breakdown metrics breakdown footer */}
                  <CardFooter className="pt-2 border-t border-white/5 bg-black/20 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-black tracking-tighter uppercase italic text-muted-foreground/60">
                    <div>HUM: <span className="text-foreground">{roast.humor}</span></div>
                    <div>CRE: <span className="text-foreground">{roast.creativity}</span></div>
                    <div>ORIG: <span className="text-foreground">{roast.originality}</span></div>
                    <div>SAV: <span className="text-battle-orange">{roast.savagery}</span></div>

                    <div className="ml-auto">
                      {index === 0 ? (
                        <Trophy className="w-4 h-4 text-yellow-500 animate-bounce" />
                      ) : index < 3 ? (
                        <Award className="w-4 h-4 text-amber-600" />
                      ) : null}
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}

        {/* Dynamic Pagination Action Button */}
        {legendaryRoasts.length > displayCount && (
          <div className="flex justify-center pt-16">
            <BattleButton
              variant="outline"
              onClick={() => setDisplayCount((prev) => prev + 6)}
              className="uppercase tracking-[0.3em] text-xs py-8 px-12 italic border-battle-orange text-battle-orange hover:bg-battle-orange hover:text-white transition-all duration-300"
            >
              LOAD MORE LEGENDS
            </BattleButton>
          </div>
        )}
      </section>
    </div>
  )
}