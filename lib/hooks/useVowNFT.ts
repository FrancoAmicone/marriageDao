import { useState, useEffect } from 'react';
import { useWalletAuth } from '@/lib/worldcoin/useWalletAuth';
import { CONTRACT_ADDRESSES, VOW_NFT_ABI } from '@/lib/contracts';
import { readContract } from '@wagmi/core';
import { wagmiConfig } from '@/lib/wagmi/config';
import { getPublicClient } from '@wagmi/core';
import { parseAbiItem } from 'viem';

export type VowNFTData = {
    tokenId: bigint;
    tokenURI: string;
    metadata: any;
};

export function useVowNFT() {
    const { address, isConnected } = useWalletAuth();
    const [vowNFTs, setVowNFTs] = useState<VowNFTData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        async function fetchVowNFTs() {
            if (!isConnected || !address) {
                if (!isActive) return;
                setVowNFTs([]);
                setIsLoading(false);
                return;
            }

            try {
                if (!isActive) return;
                setIsLoading(true);
                setError(null);

                const publicClient = getPublicClient(wagmiConfig);

                // Find Transfer events to the user
                // VowNFT Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
                const logs = await publicClient.getLogs({
                    address: CONTRACT_ADDRESSES.VOW_NFT as `0x${string}`,
                    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
                    args: {
                        to: address as `0x${string}`,
                        from: '0x0000000000000000000000000000000000000000', // Only mints
                    },
                    fromBlock: 'earliest',
                });

                if (logs.length === 0) {
                    if (!isActive) return;
                    setVowNFTs([]);
                    setIsLoading(false);
                    return;
                }

                // Process all logs found
                const tokensData: VowNFTData[] = [];

                for (const log of logs) {
                    const tokenId = log.args.tokenId;
                    if (tokenId === undefined) continue;

                    try {
                        // Get Token URI
                        const tokenURI = await readContract(wagmiConfig, {
                            address: CONTRACT_ADDRESSES.VOW_NFT as `0x${string}`,
                            abi: VOW_NFT_ABI,
                            functionName: 'tokenURI',
                            args: [tokenId],
                        }) as string;

                        // Parse metadata
                        let metadata = {};
                        if (tokenURI.startsWith('data:application/json;base64,')) {
                            const base64Data = tokenURI.split(',')[1];
                            const jsonString = atob(base64Data);
                            metadata = JSON.parse(jsonString);
                        } else if (tokenURI.startsWith('ipfs://')) {
                            const httpURI = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
                            const response = await fetch(httpURI);
                            metadata = await response.json();
                        } else {
                            const response = await fetch(tokenURI);
                            metadata = await response.json();
                        }

                        tokensData.push({
                            tokenId,
                            tokenURI,
                            metadata
                        });
                    } catch (e) {
                        console.error(`Failed to fetch metadata for token ${tokenId}`, e);
                        // Continue to next token if one fails
                    }
                }

                // Sort by Token ID descending (assuming higher ID = newer)
                tokensData.sort((a, b) => Number(b.tokenId) - Number(a.tokenId));

                if (!isActive) return;
                setVowNFTs(tokensData);

            } catch (err) {
                if (!isActive) return;
                console.error('Error fetching Vow NFTs:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch Vow NFTs');
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        fetchVowNFTs();

        return () => {
            isActive = false;
        };
    }, [address, isConnected]);

    return {
        vowNFTs,
        isLoading,
        error,
    };
}
