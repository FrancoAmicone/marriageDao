/**
 * Hook to fetch detailed marriage information from HumanBond contract
 * Returns marriage view with bondStart, marriageId, milestone info, etc.
 */

import { useState, useEffect } from 'react';
import { useWalletAuth } from '../worldcoin/useWalletAuth';
import { CONTRACT_ADDRESSES, HUMAN_BOND_ABI } from '@/lib/contracts';
import { readContract } from '@wagmi/core';
import { wagmiConfig } from '@/lib/wagmi/config';

export type MarriageView = {
    partnerA: `0x${string}`;
    partnerB: `0x${string}`;
    nullifierA: bigint;
    nullifierB: bigint;
    bondStart: bigint;
    lastClaim: bigint;
    lastMilestoneYear: bigint;
    active: boolean;
    pendingYield: bigint;
    marriageId: `0x${string}`;
};

export function useMarriageDetails(partnerAddress: `0x${string}` | null) {
    const { address, isConnected } = useWalletAuth();
    const [marriageView, setMarriageView] = useState<MarriageView | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMarriageDetails = async () => {
        if (!isConnected || !address || !partnerAddress) {
            setMarriageView(null);
            setError(null);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Fetch marriage view with all details
            const marriageData = await readContract(wagmiConfig, {
                address: CONTRACT_ADDRESSES.HUMAN_BOND as `0x${string}`,
                abi: HUMAN_BOND_ABI,
                functionName: 'getMarriageView',
                args: [address as `0x${string}`, partnerAddress],
            }) as MarriageView;

            setMarriageView(marriageData);

        } catch (err) {
            console.error('Error fetching marriage details:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch marriage details');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isActive = true;

        const loadDetails = async () => {
            if (isActive) {
                await fetchMarriageDetails();
            }
        };

        loadDetails();

        return () => {
            isActive = false;
        };
    }, [address, isConnected, partnerAddress]);

    return {
        marriageView,
        isLoading,
        error,
        refetch: fetchMarriageDetails,
    };
}
