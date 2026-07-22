"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import TruthDuel from "@/lib/contracts/RoastArena"
import { getContractAddress } from "@/lib/genlayer/client";
import type { UserProfile, ScoredRoast, Challenge } from "@/lib/contracts/types";
import { toast } from "sonner";
import { useWallets } from "@privy-io/react-auth";


export function useRoastArenaContract(): TruthDuel | null {
    const { wallets } = useWallets();
    const contractAddress = getContractAddress();
    const address = wallets[0]?.address;

    return useMemo(() => {
        if (!contractAddress || !address) {
            return null;
        }
        return new TruthDuel(contractAddress, address);
    }, [contractAddress, address]);
}

export function useCheckIfProfileExists(account_address: string | null) {
    const contract = useRoastArenaContract();

    return useQuery<boolean, Error>({
        queryKey: ["profileExists", account_address],
        queryFn: async () => {
            if (!account_address) return false;
            if (!contract) throw new Error("Contract not initialized");

            return await contract.CheckIfProfileExists(account_address);
        },
        enabled: !!account_address && !!contract,
        retry: false,
    });
}

export function useUserProfile(wallet_address: string) {
    const contract = useRoastArenaContract();

    return useQuery<UserProfile, Error>({
        queryKey: ["userProfile", wallet_address],
        queryFn: () => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.getUserProfile(wallet_address);
        },
        enabled: !!contract && !!wallet_address,
    });
}

export function useFetchChallenges() {
    const contract = useRoastArenaContract();

    return useQuery<Challenge[], Error>({
        queryKey: ["challenges"],
        queryFn: () => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            return contract.fetchChallenges();
        },
    });
}

export function useFetchChallengeById(id: string | undefined) {
    const contract = useRoastArenaContract();

    return useQuery({
        queryKey: ["challenge", id],
        queryFn: async () => {
            if (!contract) throw new Error("Contract not initialized");
            if (!id) throw new Error("Challenge ID is required");

            console.log(`🔍 Fetching challenge: ${id}`);
            const data = await contract.fetchChallengeById(id);
            console.log(`✅ Fetched challenge ${id}:`, data);
            return data;
        },
        enabled: !!id && !!contract,
        retry: 2,
        staleTime: 1000 * 60,        // 1 minute
        gcTime: 1000 * 60 * 5,       // 5 minutes
    });
}



export function useCreateProfile() {
    const contract = useRoastArenaContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            username,
        }: {
            username: string;
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }

            const receipt = await contract.createProfile(username);
            console.log("Profile creation transaction receipt:", receipt);
            return receipt;
        },

        onSuccess: async (_, variables) => {
            // refresh any relevant reads after profile creation
            await queryClient.invalidateQueries({
                queryKey: ["profileExists"],
            });

            await queryClient.invalidateQueries({
                queryKey: ["profile"],
            });
        },
    });
}

export function useCreateChallenge() {
    const contract = useRoastArenaContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            prompt,
            founder_name,   
            project_name,
            prize_pool,
            duration_seconds,
            created_at
        }: {
            prompt: string;
            founder_name: string;
            project_name: string;
            prize_pool: number;
            duration_seconds: number;
            created_at: string;
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }

            console.log("Creating challenge with params:", {
            prompt,
            founder_name,
            project_name,
            prize_pool,
            duration_seconds,
            created_at
        });

            const receipt = await contract.createChallenge(prompt, founder_name, project_name, prize_pool, duration_seconds, created_at);
            console.log("Challenge creation transaction receipt:", receipt);
            return receipt;
        },

        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["challenges"],
            });
        },
        onError: async (error) => {
            console.error("Error creating challenge:", error);
            toast.error("Failed to create challenge. Please try again.");
        }
    });
}


export function useSubmitRoast() {
    const contract = useRoastArenaContract();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            challenge_id,
            roast_content,
        }: {
            challenge_id: string;
            roast_content: string;
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }

            const receipt = await contract.submitRoast(challenge_id, roast_content);
            console.log("Roast submission transaction receipt:", receipt);
            return receipt;
        },
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["challenge", variables.challenge_id],
            });
        },
        onError: async (error) => {
            console.error("Error submitting roast:", error);
            toast.error("Failed to submit roast. Please try again.");
        }

    });
}



export function useJudgeChallenge() {
    const contract = useRoastArenaContract();
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({
            challenge_id,
        }: {
            challenge_id: string;
        }) => {
            if (!contract) {
                throw new Error("Contract not initialized");
            }
            
            const receipt = await contract.judgeChallenge(challenge_id);
            console.log("Challenge judging transaction receipt:", receipt);
            return receipt;
        }, 
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["challenge", variables.challenge_id],
            });
        },
        onError: async (error) => {
            console.error("Error judging challenge:", error);
            toast.error("Failed to judge challenge. Please try again.");
        }
    });

}


