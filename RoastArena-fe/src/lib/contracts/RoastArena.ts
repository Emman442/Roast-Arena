import { TransactionReceipt } from "@privy-io/react-auth";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

import { TransactionStatus } from "genlayer-js/types"
import { parseEther } from "viem";
import { Challenge, UserProfile } from "./types";


/**
 * RoastArena contract class for interacting with the GenLayer RoastArena contract
 */

class RoastArena {
    private contractAddress: `0x${string}`;
    private client: ReturnType<typeof createClient>;

    constructor(
        contractAddress: string,
        address?: string | null,
        studioUrl?: string
    ) {
        this.contractAddress = contractAddress as `0x${string}`;

        const config: any = {
            chain: studionet,
        };

        if (address) {
            config.account = address as `0x${string}`;
        }

        if (studioUrl) {
            config.endpoint = studioUrl;
        }

        this.client = createClient(config);
    }

    /**
     * Update the address used for transactions
     */
    updateAccount(address: string): void {
        const config: any = {
            chain: studionet,
            account: address as `0x${string}`,
        };

        this.client = createClient(config);
    }


    /**
     * Get a particular user profile from the contract
     * @returns a user profile object with all relevant details
     */
    async CheckIfProfileExists(account_address: string): Promise<boolean> {

        try {
            const profile_exists: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "creator_exists",
                args: [account_address],
            });

            return profile_exists as boolean;

        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw new Error("Failed to check if user profile exists");
        }
    }


    async getUserProfile(wallet_address: string): Promise<UserProfile
    > {
        try {
            const profile: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "get_user",
                args: [wallet_address],
            });

            console.log("profile: ", profile)


            return profile as UserProfile;

        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw new Error("Failed to fetch user profile");
        }
    }



    async fetchChallenges(): Promise<Challenge[]> {
        try {
            const challenges: any = await this.client.readContract({
                address: this.contractAddress,
                functionName: "fetch_all_challenges",
            });


            return challenges as Challenge[];

        } catch (error) {
            console.error("Error fetching challenges:", error);
            throw new Error("Failed to fetch challenges");
        }
    }


    async fetchChallengeById(challengeId: string): Promise<Challenge> {
        try {
            const challenge = await this.client.readContract({
                address: this.contractAddress,
                functionName: "get_challenge",
                args: [challengeId],
            });

            console.log("Fetched challenge:", challenge);

            if (!challenge) {
                throw new Error("Challenge not found");
            }

            return challenge as Challenge;

        } catch (error) {
            console.error("Error fetching challenge:", error);
            throw error;
        }
    }




    async createProfile(username: string) {
        await this.client.connect("studionet");
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "register_creator",
                args: [username],
                value: BigInt(0),
            });

            const receipt = await this.client.waitForTransactionReceipt({
                hash: txHash,
                status: "ACCEPTED" as any,
            });
            console.log("Receopttt", receipt)
            return receipt as TransactionReceipt
                ;
        } catch (error) {
            console.error("Error creating profile:", error);
            throw new Error("Failed to create profile");
        }
    }


    async createChallenge(
        prompt: string,
        founder_name: string,
        project_name: string,
        prize_pool: number,
        duration_seconds: number,
        created_at: string
    ) {

        await this.client.connect("studionet");
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "create_challenge",
                args: [prompt, founder_name, project_name, prize_pool, duration_seconds, created_at],
                value: parseEther(prize_pool.toString()),
            });

            const receipt = await this.client.waitForTransactionReceipt({
                hash: txHash,
                status: TransactionStatus.ACCEPTED,
            });

            return receipt as TransactionReceipt;
        } catch (error) {
            console.error("Error creating challenge:", error);
            throw new Error("Failed to create challenge");
        }
    }



    async submitRoast(challenge_id: string, roast_content: string) {
        await this.client.connect("studionet");
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "submit_roast",
                args: [challenge_id, roast_content],
                value: BigInt(0),
            });
            const receipt = await this.client.waitForTransactionReceipt({
                hash: txHash,
                status: TransactionStatus.ACCEPTED,
            });
            return receipt as TransactionReceipt;
        } catch (error) {
            console.error("Error submitting roast:", error);
            throw new Error("Failed to submit roast");
        }
    }

    async judgeChallenge(challenge_id: string) {
        await this.client.connect("studionet");
        try {
            const txHash = await this.client.writeContract({
                address: this.contractAddress,
                functionName: "judge_challenge",
                args: [challenge_id],
                value: BigInt(0),
            });

            const receipt = await this.client.waitForTransactionReceipt({
                hash: txHash,
                status: TransactionStatus.ACCEPTED,
                retries: 60,
                interval: 5000,
            });
            return receipt as TransactionReceipt;

        } catch (error) {
            console.error("Error judging challenge:", error);
            throw new Error("Failed to judge challenge");
        }
    }


}


export default RoastArena;