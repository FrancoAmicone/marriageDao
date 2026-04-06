import { useQuery } from '@tanstack/react-query';
import { useWalletAuth } from '@/lib/worldcoin/useWalletAuth';
import { CONTRACT_ADDRESSES, MILESTONE_NFT_ABI } from '@/lib/contracts';
import { readContract, getPublicClient } from '@wagmi/core';
import { wagmiConfig } from '@/lib/wagmi/config';
import { parseAbiItem } from 'viem';
import { parseTokenMetadata } from '@/lib/utils/parseTokenMetadata';

export type MilestoneNFTData = {
    tokenId: bigint;
    year: bigint;
    tokenURI: string;
    metadata: any;
};

async function fetchSingleMilestone(tokenId: bigint): Promise<MilestoneNFTData> {
    const contractAddr = CONTRACT_ADDRESSES.MILESTONE_NFT as `0x${string}`;

    const [year, tokenURI] = await Promise.all([
        readContract(wagmiConfig, {
            address: contractAddr,
            abi: MILESTONE_NFT_ABI,
            functionName: 'tokenYear',
            args: [tokenId],
        }) as Promise<bigint>,
        readContract(wagmiConfig, {
            address: contractAddr,
            abi: MILESTONE_NFT_ABI,
            functionName: 'tokenURI',
            args: [tokenId],
        }) as Promise<string>,
    ]);

    let metadata = {};
    try {
        metadata = await parseTokenMetadata(tokenURI);
    } catch (e) {
        console.error(`Failed to fetch metadata for milestone token ${tokenId}:`, e);
    }

    return { tokenId, year, tokenURI, metadata };
}

async function fetchAllMilestones(address: `0x${string}`): Promise<MilestoneNFTData[]> {
    const publicClient = getPublicClient(wagmiConfig);

    const logs = await publicClient.getLogs({
        address: CONTRACT_ADDRESSES.MILESTONE_NFT as `0x${string}`,
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
        args: {
            to: address,
            from: '0x0000000000000000000000000000000000000000',
        },
        fromBlock: 'earliest',
    });

    if (logs.length === 0) return [];

    const tokenIds = logs
        .map(log => log.args.tokenId)
        .filter((id): id is bigint => id !== undefined);

    const milestones = await Promise.all(tokenIds.map(fetchSingleMilestone));
    milestones.sort((a, b) => Number(b.year - a.year));
    return milestones;
}

export function useMilestoneNFTs() {
    const { address, isConnected } = useWalletAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ['milestoneNFTs', address],
        queryFn: () => fetchAllMilestones(address as `0x${string}`),
        enabled: isConnected && !!address,
        staleTime: 60_000,
    });

    return {
        milestones: data ?? [],
        isLoading,
        error: error ? (error instanceof Error ? error.message : 'Failed to fetch Milestone NFTs') : null,
    };
}
