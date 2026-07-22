"use client"

import Image from "next/image"
import { ArenaBattle } from "@/components/arena/ArenaBattle"
import { BattleButton } from "@/components/ui/battle-button"
import { Timer, Users, Trophy, ChevronLeft, Share2, Info, Zap, DiffIcon } from "lucide-react"
import Link from "next/link"
import { useFetchChallengeById } from "@/hooks/RoastArena"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getTimeLeft } from "@/lib/utils/getTimeLeft"
import { useWallets } from "@privy-io/react-auth"
import FounderPanel from "@/components/ui/founder-panel"

export default function ArenaDetailPage({ }) {

  const params = useParams()
  const id = params?.id as string

  const { isFetching, data: challenge, error, isError } = useFetchChallengeById(id);
  console.log(id)
  console.log("Challenge data:", challenge)
  console.log("error", error)
  console.log("isFetching:", isFetching)

  const [timeLeft, setTimeLeft] = useState(
    getTimeLeft(new Date(challenge?.deadline || 0).getTime())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(new Date(challenge?.deadline || 0).getTime()));
    }, 1000);

    return () => clearInterval(interval);
  }, [challenge?.deadline]);



  const { wallets } = useWallets();
  const currentAddress = wallets[0]?.address?.toLowerCase();

  const isFounder =
    currentAddress === challenge?.founder_address?.toLowerCase();




  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">
            Loading Arena...
          </p>
        </div>
      </div>
    );
  }


  // No ID or Invalid ID
  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-black">Invalid Arena ID</h2>
          <p className="text-muted-foreground">No arena ID provided in the URL.</p>
          <Link href="/">
            <BattleButton>Back To Arenas</BattleButton>
          </Link>
        </div>
      </div>
    )
  }

  if (isError || !challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-black">Arena Not Found</h2>
          <p className="text-muted-foreground">Could not find challenge with ID: <span className="font-mono">{id}</span></p>
          <Link href="/arena">
            <BattleButton>Back to Arenas</BattleButton>
          </Link>
        </div>
      </div>
    );
  }

    const hasEnded =
  Date.now() >= challenge?.deadline;
  console.log("hasEnded:", hasEnded)

  return (
    <div className="min-h-screen flex flex-col pt-24">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto w-full px-6 mb-8 flex items-center justify-between">
        <Link href="/" passHref>
          <BattleButton variant="ghost" size="sm" className="flex items-center gap-2 group">
            <div className="flex gap-2 items-center text-sm font-bold uppercase text-primary">
              <span><ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /></span>
              <span>BACK TO ARENAS</span>
            </div>

          </BattleButton>
        </Link>
        <BattleButton variant="outline" size="sm">
          <div className="flex gap-2 items-center justify-center">
            <Share2 className="w-4 h-4" /> SHARE ARENA
          </div>
        </BattleButton>
      </div>

      {/* Arena Header */}
      <section className="max-w-7xl mx-auto w-full px-6 mb-12">
        <div className="glass p-8 md:p-12 rounded-2xl border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 pointer-events-none" />

          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            {/* Boss Profile */}
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-primary/40 overflow-hidden rotate-3 shadow-[0_0_30px_rgba(188,19,254,0.2)]">
                <Image src={challenge?.boss_avatar ? challenge?.boss_avatar : "https://picsum.photos/seed/boss1/400/400"} alt="" fill className="object-cover" />
              </div>
              <div className="text-center">
                <span className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Arena Boss</span>
                <h2 className="text-xl font-black uppercase tracking-tighter italic">{challenge?.founder}</h2>
                <span className="text-xs text-secondary font-bold">{challenge?.project_name}</span>
              </div>
            </div>

            {/* Challenge Info */}
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 bg-battle-red text-white text-[10px] font-black uppercase tracking-widest rounded-sm">{challenge?.difficulty ? challenge?.difficulty : "Savage"} BATTLE</span>
                  <span className="px-3 py-1 glass border-secondary/50 text-secondary text-[10px] font-black uppercase tracking-widest rounded-sm">GEN REWARDS</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">{challenge?.prompt}</h1>
              </div>

              <div className="bg-black/40 p-6 rounded-xl border border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-widest">
                  <Info className="w-4 h-4" /> Mission Objective
                </div>
                <p className="text-muted-foreground font-medium leading-relaxed italic">
                  "{challenge?.prompt}"
                </p>
                {/* <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
                  {arenaData.description}
                </p> */}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-gold" /> Total Pool
                  </span>
                  <div className="text-2xl font-black text-gold leading-none">{challenge?.prize_pool} GEN</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                    <Timer className="w-3 h-3 text-battle-red" /> Battle Ends
                  </span>
                  <div className="text-2xl font-black text-battle-red leading-none">{timeLeft}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                    <Users className="w-3 h-3 text-secondary" /> Contenders
                  </span>
                  <div className="text-2xl font-black leading-none">{challenge?.participants.length}</div>
                </div>
                <div className="space-y-1 hidden md:block">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-1">
                    <DiffIcon className="w-3 h-3 text-primary" /> Diffficulty
                  </span>
                  <div className="text-2xl font-black text-primary leading-none">Savage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Battle Component */}
      {isFounder
        ? <FounderPanel challenge={challenge} isFounder={isFounder} hasEnded={hasEnded}/> :
        < ArenaBattle
          challengeId={challenge?.challenge_id}
          bossName={challenge?.founder}
          challengePrompt={challenge?.prompt}
          prizePool={challenge?.prize_pool.toString() || "0"}
          status={challenge?.status}
          founderAddress={challenge?.founder_address}
          deadline={challenge?.deadline.toString() || ""}
          scores={challenge?.scores || []}
        />}
    </div>
  )
}
