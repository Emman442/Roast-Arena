"use client"
import { ArenaCard } from '@/components/arena/ArenaCard'
import { BattleButton } from '@/components/ui/battle-button'
import { useFetchChallenges } from '@/hooks/RoastArena';
import Link from 'next/link'

import React from 'react'

export default function page() {

    const { isFetching, data: arenas } = useFetchChallenges();
    console.log(arenas)

    if (isFetching) {
        return (
            <div className="py-20 px-6">
                Loading arenas...
            </div>
        );
    }

    return (
        <div>
            <div className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12 scroll-mt-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-primary pl-6">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic">Active <span className="text-primary">Arenas</span></h2>
                        <p className="text-muted-foreground font-medium">Current boss battles with open prize pools.</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
                        <span className="text-primary">Live Now</span>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {arenas?.map((arena) => (
                        <ArenaCard key={arena.challenge_id} {...arena} />
                    ))}
                </div>

        
            </div>

        </div>
    )
}
