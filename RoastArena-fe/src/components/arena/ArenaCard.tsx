"use client"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BattleButton } from "@/components/ui/battle-button"
import { Timer, Users, Trophy, Cpu } from "lucide-react"
import Link from "next/link"
import { getTimeLeft } from "@/lib/utils/getTimeLeft"
import { useEffect, useState } from "react"
import Avatar from "boring-avatars"
interface ArenaCardProps {
  challenge_id: string
  founder: string
  bossAvatar: string
  project_name: string
  prompt: string
  founder_address: string,
  status: string,
  prize_pool: string
  deadline: string
  participants: [],
}

export function ArenaCard({
  challenge_id,
  founder,
  bossAvatar,
  project_name,
  // projectLogo,
  prompt,
  founder_address,
  status,
  prize_pool,
  deadline,
  participants,
}: ArenaCardProps) {


  const [timeLeft, setTimeLeft] = useState(
    getTimeLeft(new Date(deadline).getTime())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(new Date(deadline).getTime()));
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <Card className="arena-card glass border-primary/20 hover:border-primary/50 overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 flex gap-2">

        <Badge variant="outline" className="bg-black/50 border-secondary text-secondary flex items-center gap-1">
          <Cpu className="w-3 h-3" /> AI JUDGE
        </Badge>
      </div>

      <CardHeader className="flex flex-row items-center gap-4 pt-6">
        <div className="relative w-12 h-12 rounded-full border-2 border-primary/50 overflow-hidden shrink-0">

          <Avatar
            size={50}
            name={founder}
            variant="beam"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Arena Boss</span>
          <span className="text-lg font-black tracking-tight leading-tight">{founder}</span>
          <span className="text-xs text-secondary font-bold">{project_name}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-white/5 p-4 rounded-lg border border-white/10 min-h-[80px] flex items-center justify-center text-center">
          <p className="text-sm italic font-medium">"{prompt}"</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Trophy className="w-3 h-3 text-gold" /> Prize Pool
            </span>
            <span className="text-xl font-black text-gold">{prize_pool} <span className="text-xs font-normal opacity-70">GEN</span></span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Timer className="w-3 h-3 text-battle-red" /> Ends In
            </span>
            <span className="text-lg font-bold text-battle-red">{timeLeft}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="w-3.5 h-3.5" />
          <span className="font-bold">{participants.length} Fighters</span>
        </div>
        <Link href={`/arena/${challenge_id}`} passHref>
          <BattleButton variant="primary" size="sm" className="font-black text-[10px]">
            ENTER BATTLE
          </BattleButton>
        </Link>
      </CardFooter>
    </Card>
  )
}
