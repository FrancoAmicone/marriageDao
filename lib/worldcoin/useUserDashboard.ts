/**
 * Hook to fetch user dashboard data from HumanBond contract
 * Returns marriage status, proposal status, and token balance
 */

import { useState, useEffect } from 'react';
import { useWalletAuth } from './useWalletAuth';
import { CONTRACT_ADDRESSES, HUMAN_BOND_ABI } from '@/lib/contracts';
import { readContract } from '@wagmi/core';
import { wagmiConfig } from '@/lib/wagmi/config';

export type UserDashboard = {
    isMarried: boolean;
    partner: `0x${string}`;
    pendingYield: bigint;
    timeBalance: bigint;
};

export function useUserDashboard() {
    const { address, isConnected } = useWalletAuth();
    const [dashboard, setDashboard] = useState<UserDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        async function fetchDashboard() {
            if (!isConnected || !address) {
                if (!isActive) return;
                setDashboard(null);
                setError(null);
                setIsLoading(false);
                return;
            }

            try {
                if (!isActive) return;
                setIsLoading(true);
                setError(null);

                // Fetch user dashboard
                const dashboardData = await readContract(wagmiConfig, {
                    address: CONTRACT_ADDRESSES.HUMAN_BOND as `0x${string}`,
                    abi: HUMAN_BOND_ABI,
                    functionName: 'getUserDashboard',
                    args: [address as `0x${string}`],
                }) as UserDashboard;

                if (!isActive) return;
                setDashboard(dashboardData);

            } catch (err) {
                if (!isActive) return;
                console.error('Error fetching user dashboard:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch dashboard');
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        fetchDashboard();

        return () => {
            isActive = false;
        };
    }, [address, isConnected]);

    return {
        dashboard,
        isLoading,
        error,
        refetch: async () => {
            if (address && isConnected) {
                setIsLoading(true);
                try {
                    const dashboardData = await readContract(wagmiConfig, {
                        address: CONTRACT_ADDRESSES.HUMAN_BOND as `0x${string}`,
                        abi: HUMAN_BOND_ABI,
                        functionName: 'getUserDashboard',
                        args: [address as `0x${string}`],
                    }) as UserDashboard;

                    setDashboard(dashboardData);
                } catch (err) {
                    console.error('Error refetching dashboard:', err);
                    setError(err instanceof Error ? err.message : 'Failed to refetch');
                } finally {
                    setIsLoading(false);
                }
            }
        },
    };
}
