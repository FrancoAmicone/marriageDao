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
    const [vowNFT, setVowNFT] = useState<VowNFTData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        async function fetchVowNFT() {
            if (!isConnected || !address) {
                if (!isActive) return;
                setVowNFT(null);
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
                    setVowNFT(null);
                    setIsLoading(false);
                    return;
                }

                // Assuming user has only one Vow NFT (Soulbound)
                // If they have multiple (e.g. remarried), we take the latest one?
                // The logs are usually returned in order. Let's take the last one.
                const latestLog = logs[logs.length - 1];
                const tokenId = latestLog.args.tokenId;

                if (tokenId === undefined) {
                    throw new Error("Token ID not found in log");
                }

                // Get Token URI
                const tokenURI = await readContract(wagmiConfig, {
                    address: CONTRACT_ADDRESSES.VOW_NFT as `0x${string}`,
                    abi: VOW_NFT_ABI,
                    functionName: 'tokenURI',
                    args: [tokenId],
                }) as string;

                console.log('🎨 VowNFT tokenURI:', tokenURI);

                // Parse metadata - VowNFT returns base64 encoded JSON
                let metadata = {};
                try {
                    if (tokenURI.startsWith('data:application/json;base64,')) {
                        // Decode base64 JSON
                        const base64Data = tokenURI.split(',')[1];
                        const jsonString = atob(base64Data);
                        metadata = JSON.parse(jsonString);
                        console.log('✅ VowNFT metadata (base64):', metadata);
                    } else if (tokenURI.startsWith('ipfs://')) {
                        // Fetch from IPFS
                        const httpURI = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
                        const response = await fetch(httpURI);
                        metadata = await response.json();
                        console.log('✅ VowNFT metadata (IPFS):', metadata);
                    } else {
                        // Try direct fetch
                        const response = await fetch(tokenURI);
                        metadata = await response.json();
                        console.log('✅ VowNFT metadata (HTTP):', metadata);
                    }
                } catch (e) {
                    console.error('❌ Failed to parse VowNFT metadata:', e);
                }

                if (!isActive) return;
                setVowNFT({
                    tokenId,
                    tokenURI,
                    metadata
                });

            } catch (err) {
                if (!isActive) return;
                console.error('Error fetching Vow NFT:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch Vow NFT');
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        fetchVowNFT();

        return () => {
            isActive = false;
        };
    }, [address, isConnected]);

    return {
        vowNFT,
        isLoading,
        error,
    };
}
