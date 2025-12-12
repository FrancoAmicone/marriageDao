/**
 * Hook to fetch proposal data from HumanBond contract
 * Returns incoming proposals and outgoing proposal status
 */

import { useState, useEffect } from 'react';
import { useWalletAuth } from '../worldcoin/useWalletAuth';
import { CONTRACT_ADDRESSES, HUMAN_BOND_ABI } from '@/lib/contracts';
import { readContract } from '@wagmi/core';
import { wagmiConfig } from '@/lib/wagmi/config';

export type ProposalInfo = {
    proposer: `0x${string}`;
    proposed: `0x${string}`;
    proposerNullifier: bigint;
    accepted: boolean;
    timestamp: bigint;
};

export type ProposalsData = {
    incomingProposals: ProposalInfo[];
    outgoingProposal: ProposalInfo | null;
    hasPendingProposal: boolean;
};

export function useProposals() {
    const { address, isConnected } = useWalletAuth();
    const [data, setData] = useState<ProposalsData>({
        incomingProposals: [],
        outgoingProposal: null,
        hasPendingProposal: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProposals = async () => {
        if (!isConnected || !address) {
            setData({
                incomingProposals: [],
                outgoingProposal: null,
                hasPendingProposal: false,
            });
            setError(null);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Fetch incoming proposals (proposals made TO this user)
            const incomingProposals = await readContract(wagmiConfig, {
                address: CONTRACT_ADDRESSES.HUMAN_BOND as `0x${string}`,
                abi: HUMAN_BOND_ABI,
                functionName: 'getIncomingProposals',
                args: [address as `0x${string}`],
            }) as ProposalInfo[];

            // Check if user has sent a proposal (hasPendingProposal)
            const hasPending = await readContract(wagmiConfig, {
                address: CONTRACT_ADDRESSES.HUMAN_BOND as `0x${string}`,
                abi: HUMAN_BOND_ABI,
                functionName: 'hasPendingProposal',
                args: [address as `0x${string}`],
            }) as boolean;

            let outgoingProposal: ProposalInfo | null = null;

            // If user has pending proposal, fetch its details
            if (hasPending) {
                outgoingProposal = await readContract(wagmiConfig, {
                    address: CONTRACT_ADDRESSES.HUMAN_BOND as `0x${string}`,
                    abi: HUMAN_BOND_ABI,
                    functionName: 'getProposal',
                    args: [address as `0x${string}`],
                }) as ProposalInfo;
            }

            setData({
                incomingProposals,
                outgoingProposal,
                hasPendingProposal: hasPending,
            });

        } catch (err) {
            console.error('Error fetching proposals:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch proposals');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isActive = true;

        const loadProposals = async () => {
            if (isActive) {
                await fetchProposals();
            }
        };

        loadProposals();

        return () => {
            isActive = false;
        };
    }, [address, isConnected]);

    return {
        ...data,
        isLoading,
        error,
        refetch: fetchProposals,
    };
}

