"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVowNFT } from "@/lib/hooks/useVowNFT";
import { useMilestoneNFTs } from "@/lib/hooks/useMilestoneNFTs";
import { NFTCard } from "@/app/components/marriage/NFTCard";
import { MiniKit } from "@worldcoin/minikit-js";
import { CONTRACT_ADDRESSES, HUMAN_BOND_ABI } from "@/lib/contracts";

export default function GalleryPage() {
    const router = useRouter();
    const { vowNFTs, isLoading: loadingVow, error: vowError } = useVowNFT();
    const { milestones, isLoading: loadingMilestones, error: milestonesError } = useMilestoneNFTs();

    const [mintingState, setMintingState] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [showNotAvailableModal, setShowNotAvailableModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleMintMilestones = async () => {
        try {
            setMintingState("sending");

            const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
                transaction: [
                    {
                        address: CONTRACT_ADDRESSES.HUMAN_BOND,
                        abi: HUMAN_BOND_ABI,
                        functionName: "manualCheckAndMint",
                        args: [],
                    },
                ],
            });

            if (finalPayload.status === "error") {
                // Any error means no milestones available - show friendly modal
                setMintingState("idle");
                setShowNotAvailableModal(true);
                return;
            }

            setMintingState("success");
            setShowSuccessModal(true);
        } catch (err) {
            // Any error means no milestones available - show friendly modal
            setMintingState("idle");
            setShowNotAvailableModal(true);
        }
    };

    const isLoading = loadingVow || loadingMilestones;

    return (
        <main className="min-h-screen bg-[#E8E8E8] pb-20">
            {/* Page Header - positioned below the global fixed header */}
            <div className="bg-[#D8D8D8]/90 backdrop-blur-sm shadow-sm sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/home')}
                        className="text-sm text-gray-600 hover:text-black transition-colors"
                    >
                        ← Back
                    </button>
                    <h1 className="font-bold text-lg text-black">Our Memories</h1>
                    <div className="w-16"></div> {/* Spacer for centering */}
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black"></div>
                        <p className="text-sm text-gray-600">Loading your memories...</p>
                    </div>
                ) : (
                    <>
                        {/* Errors */}
                        {(vowError || milestonesError) && (
                            <div className="bg-white rounded-2xl p-4 shadow-lg border border-red-300">
                                <div className="font-bold mb-2 text-sm text-black">Error Loading NFTs</div>
                                {vowError && <div className="text-sm text-gray-600">Vow NFT: {vowError}</div>}
                                {milestonesError && <div className="text-sm text-gray-600">Milestones: {milestonesError}</div>}
                            </div>
                        )}

                        {/* Vow NFT Section */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-black">💍 Your Vows</h2>
                            </div>

                            {vowNFTs.length > 0 ? (
                                <div className="flex overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6 space-x-4 no-scrollbar">
                                    {vowNFTs.map((nft, index) => {
                                        // Extract marriage details from attributes
                                        const attrs = nft.metadata?.attributes || [];
                                        const partnerA = attrs.find((a: any) => a.trait_type === 'partnerA')?.value;
                                        const partnerB = attrs.find((a: any) => a.trait_type === 'partnerB')?.value;
                                        const marriageDate = attrs.find((a: any) => a.trait_type === 'marriageDate')?.value;
                                        const marriageId = attrs.find((a: any) => a.trait_type === 'marriageId')?.value;

                                        // Format date if available
                                        let formattedDate = '';
                                        if (marriageDate) {
                                            const date = new Date(parseInt(marriageDate) * 1000);
                                            formattedDate = date.toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            });
                                        }

                                        // Create custom description
                                        const customDescription = formattedDate
                                            ? `Marriage certified on ${formattedDate}. This NFT represents the verified bond between two humans.`
                                            : nft.metadata?.description;

                                        // Mock image for demo purposes
                                        const MOCK_IMAGE_URL = "https://ipfs.io/ipfs/bafkreigg2jeevy3rhgzgnhk22vsbclszceos3jlzg4otuqal62vwokzwai";

                                        // Add a visual indicator for the latest marriage
                                        const isLatest = index === 0;

                                        return (
                                            <div key={nft.tokenId.toString()} className="min-w-[85%] sm:min-w-[350px] snap-center relative">
                                                <NFTCard
                                                    image={MOCK_IMAGE_URL}
                                                    name={isLatest ? "Current Marriage Certificate" : "Past Marriage Certificate"}
                                                    description={customDescription}
                                                    tokenId={nft.tokenId.toString()}
                                                    customMetadata={{
                                                        partnerA,
                                                        partnerB,
                                                        marriageDate: formattedDate,
                                                        marriageId: marriageId?.substring(0, 10) + '...'
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 bg-white rounded-3xl shadow-lg text-center space-y-2">
                                    <p className="text-gray-600">No Vow NFT found</p>
                                    <p className="text-sm text-gray-500">You need to be married to have a Vow NFT.</p>
                                </div>
                            )}
                        </section>

                        {/* Milestones Section */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-black">🏆 Milestones</h2>
                                <button
                                    onClick={handleMintMilestones}
                                    disabled={mintingState === "sending"}
                                    className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-black/90 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {mintingState === "sending" ? "Checking..." : "Check & Mint"}
                                </button>
                            </div>


                            {milestones.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {milestones.map((nft) => {
                                        // Extract milestone verification from attributes
                                        const attrs = nft.metadata?.attributes || [];
                                        const yearValue = attrs.find((a: any) => a.trait_type === 'Milestone Year')?.value;
                                        const verification = attrs.find((a: any) => a.trait_type === 'Verification')?.value;

                                        // Custom name and description
                                        const customName = `Anniversary Year ${nft.year}`;
                                        const customDesc = nft.metadata?.description || `${yearValue} year${parseInt(yearValue) > 1 ? 's' : ''} of verified commitment`;

                                        return (
                                            <NFTCard
                                                key={nft.tokenId.toString()}
                                                image={nft.metadata?.image?.replace('ipfs://', 'https://ipfs.io/ipfs/') || ''}
                                                name={customName}
                                                description={customDesc}
                                                tokenId={nft.tokenId.toString()}
                                                year={nft.year.toString()}
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 bg-white rounded-3xl shadow-lg text-center space-y-2">
                                    <p className="text-gray-600">No milestones yet</p>
                                    <p className="text-sm text-gray-500">
                                        Milestones are earned on every anniversary. Click "Check & Mint" to see if you're eligible!
                                    </p>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>

            {/* Not Available Modal */}
            {showNotAvailableModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowNotAvailableModal(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="text-center space-y-4">
                            {/* Icon */}
                            <div className="text-5xl">📅</div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-black">
                                Not Yet Available
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Milestone NFTs are unlocked on each anniversary of your marriage.
                                Come back after your next anniversary to claim your milestone!
                            </p>

                            {/* Button */}
                            <button
                                onClick={() => setShowNotAvailableModal(false)}
                                className="w-full mt-6 py-3 px-6 rounded-full text-sm font-medium text-white bg-black hover:bg-black/90 transition-colors"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowSuccessModal(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="text-center space-y-4">
                            {/* Icon */}
                            <div className="text-5xl">✨</div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-black">
                                Milestone Unlocked!
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Your milestone NFT is being minted. Refresh the page in a moment to see it in your gallery.
                            </p>

                            {/* Button */}
                            <button
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    window.location.reload();
                                }}
                                className="w-full mt-6 py-3 px-6 rounded-full text-sm font-medium text-white bg-black hover:bg-black/90 transition-colors"
                            >
                                Refresh Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
