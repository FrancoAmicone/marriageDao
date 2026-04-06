import { useQuery } from '@tanstack/react-query';
import { useWalletAuth } from '@/lib/worldcoin/useWalletAuth';
import { CONTRACT_ADDRESSES, VOW_NFT_ABI } from '@/lib/contracts';
import { readContract, getPublicClient } from '@wagmi/core';
import { wagmiConfig } from '@/lib/wagmi/config';
import { parseAbiItem } from 'viem';
import { parseTokenMetadata } from '@/lib/utils/parseTokenMetadata';

export type VowNFTData = {
    tokenId: bigint;
    tokenURI: string;
    metadata: any;
};

async function fetchSingleVow(tokenId: bigint): Promise<VowNFTData | null> {
    try {
        const tokenURI = await readContract(wagmiConfig, {
            address: CONTRACT_ADDRESSES.VOW_NFT as `0x${string}`,
            abi: VOW_NFT_ABI,
            functionName: 'tokenURI',
            args: [tokenId],
        }) as string;

        let metadata = {};
        try {
            metadata = await parseTokenMetadata(tokenURI);
        } catch {
            console.error(`Failed to fetch metadata for vow token ${tokenId}`);
        }

        return { tokenId, tokenURI, metadata };
    } catch (e) {
        console.error(`Failed to fetch vow token ${tokenId}`, e);
        return null;
    }
}

async function fetchAllVowNFTs(address: `0x${string}`): Promise<VowNFTData[]> {
    const publicClient = getPublicClient(wagmiConfig);

    const logs = await publicClient.getLogs({
        address: CONTRACT_ADDRESSES.VOW_NFT as `0x${string}`,
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

    const results = await Promise.all(tokenIds.map(fetchSingleVow));
    const tokensData = results.filter((r): r is VowNFTData => r !== null);
    tokensData.sort((a, b) => Number(b.tokenId) - Number(a.tokenId));
    return tokensData;
}

export function useVowNFT() {
    const { address, isConnected } = useWalletAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ['vowNFTs', address],
        queryFn: () => fetchAllVowNFTs(address as `0x${string}`),
        enabled: isConnected && !!address,
        staleTime: 60_000,
    });

    return {
        vowNFTs: data ?? [],
        isLoading,
        error: error ? (error instanceof Error ? error.message : 'Failed to fetch Vow NFTs') : null,
    };
}
