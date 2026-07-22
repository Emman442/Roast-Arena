"use client"
import React, { useEffect, useState } from 'react'
import { BattleButton } from './battle-button'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useCheckIfProfileExists } from '@/hooks/RoastArena';
import toast from '@/lib/utils/toast';
import Modal from './modal';
import { ClimbingBoxLoader } from 'react-spinners';
import ProfileSetupModal from './profileSetupModal';
import LoginButton from './loginButton';
import { Button } from './button';
import { Wallet } from 'lucide-react';

export default function Navbar() {

    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { wallets, ready } = useWallets();
    const [hasChecked, setHasChecked] = useState(false);
    const [showSetupModal, setShowSetupModal] = useState(false);
    const embeddedWallet = wallets[0];
    const address = embeddedWallet?.address;
    const { isLoading, data: profileExists } = useCheckIfProfileExists(address);
    console.log(profileExists)
    // console.log(address)

     useEffect(() => {
    if (!address) {
      setHasChecked(false);
      setShowSetupModal(false);
      return;
    }

    // Wait for loading to finish
    if (isLoading) return;

    // Only run once per address
    if (hasChecked) return;

    setHasChecked(true);

    if (profileExists) {
     
    } else {
      setShowSetupModal(true);
    }
  }, [address, isLoading, profileExists, hasChecked]);

    return (
        <>
            <Modal
                isOpen={!!address && isLoading}
                onClose={() => { }}
                showCloseButton={false}
                size="sm"
            >
                <div className="flex flex-col items-center gap-4 py-4">
                    <ClimbingBoxLoader size={10} color="#BC17FD" />
                    <div className="text-center space-y-1">
                        <p className="text-sm font-bold text-white">Checking your profile</p>
                        <p className="text-xs text-muted-foreground">
                            Connecting to GenLayer...
                        </p>
                    </div>
                </div>
            </Modal>


            {isLoading == false && <ProfileSetupModal
                isOpen={showSetupModal}
                onClose={() => setShowSetupModal(false)}
                address={address || ""}
                onProfileCreated={() => {
                    toast.success("Profile created!", {
                        description: "Welcome to RoastArena!",
                    });
                    setShowSetupModal(false);
                }}
            />}

            <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center font-black italic text-xl -rotate-12 shadow-[0_0_15px_rgba(188,19,254,0.5)]">R</div>
                    <span className="font-headline font-black text-2xl tracking-tighter uppercase italic">Roast<span className="text-primary">Arena</span></span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    <Link href="/arena" className="hover:text-primary transition-colors">Arenas</Link>
                    <Link href="/hall-of-fame" className="hover:text-primary transition-colors">Hall of Fame</Link>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        {address ? (
                            <>
                                <Button variant="outline" className="hidden lg:flex gap-2">
                                    <Wallet className="w-4 h-4" />
                                    {address.slice(0, 6)}...{address.slice(-4)}
                                </Button>
                            </>
                        ) : (
                            <LoginButton />
                        )}
                    </div>

                    {/* <BattleButton variant="outline" size="sm" className="hidden sm:flex">CONNECT WALLET</BattleButton> */}
                    <Link href="#arenas">
                        <BattleButton variant="primary" size="sm">ENTER ARENA</BattleButton>
                    </Link>
                </div>
            </nav>
        </>
    )
}
