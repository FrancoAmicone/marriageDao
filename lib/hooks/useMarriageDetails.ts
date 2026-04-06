import { useQuery } from '@tanstack/react-query';
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

async function fetchMarriageDetails(
    address: `0x${string}`,
    partnerAddress: `0x${string}`,
): Promise<MarriageView> {
    return readContract(wagmiConfig, {
        address: CONTRACT_ADDRESSES.HUMAN_BOND as `0x${string}`,
        abi: HUMAN_BOND_ABI,
        functionName: 'getMarriageView',
        args: [address, partnerAddress],
    }) as Promise<MarriageView>;
}

export function useMarriageDetails(partnerAddress: `0x${string}` | null) {
    const { address, isConnected } = useWalletAuth();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['marriageDetails', address, partnerAddress],
        queryFn: () => fetchMarriageDetails(address as `0x${string}`, partnerAddress as `0x${string}`),
        enabled: isConnected && !!address && !!partnerAddress,
        staleTime: 30_000,
    });

    return {
        marriageView: data ?? null,
        isLoading,
        error: error ? (error instanceof Error ? error.message : 'Failed to fetch marriage details') : null,
        refetch,
    };
}
