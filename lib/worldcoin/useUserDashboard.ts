import { useQuery } from '@tanstack/react-query';
import { useWalletAuth } from './useWalletAuth';
import { CONTRACT_ADDRESSES, HUMAN_BOND_ABI, TIME_TOKEN_ABI } from '@/lib/contracts';
import { readContract } from '@wagmi/core';
import { wagmiConfig } from '@/lib/wagmi/config';

export type UserDashboard = {
    isMarried: boolean;
    partner: `0x${string}`;
    pendingYield: bigint;
    timeBalance: bigint;
};

async function fetchDashboard(address: `0x${string}`): Promise<UserDashboard> {
    const [dashboardData, timeBalanceData] = await Promise.all([
        readContract(wagmiConfig, {
            address: CONTRACT_ADDRESSES.HUMAN_BOND as `0x${string}`,
            abi: HUMAN_BOND_ABI,
            functionName: 'getUserDashboard',
            args: [address],
        }),
        readContract(wagmiConfig, {
            address: CONTRACT_ADDRESSES.TIME_TOKEN as `0x${string}`,
            abi: TIME_TOKEN_ABI,
            functionName: 'balanceOf',
            args: [address],
        }),
    ]);

    return {
        ...(dashboardData as UserDashboard),
        timeBalance: timeBalanceData as bigint,
    };
}

export function useUserDashboard() {
    const { address, isConnected } = useWalletAuth();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['userDashboard', address],
        queryFn: () => fetchDashboard(address as `0x${string}`),
        enabled: isConnected && !!address,
        staleTime: 15_000,
    });

    return {
        dashboard: data ?? null,
        isLoading,
        error: error ? (error instanceof Error ? error.message : 'Failed to fetch dashboard') : null,
        refetch,
    };
}
