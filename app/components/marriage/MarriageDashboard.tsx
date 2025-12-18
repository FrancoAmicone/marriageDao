/**
 * Marriage Dashboard Component
 * Displays marriage information when user is bonded
 * Shows partner, TIME tokens, and divorce option
 */

"use client";

import { useState, useMemo } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { CONTRACT_ADDRESSES, HUMAN_BOND_ABI } from "@/lib/contracts";
import { useAuthStore } from "@/state/authStore";
import { UserDashboard } from "@/lib/worldcoin/useUserDashboard";
import { useMarriageDetails } from "@/lib/hooks/useMarriageDetails";

type DivorceState = "idle" | "sending" | "success" | "error";
type ClaimState = "idle" | "sending" | "success" | "error";

interface MarriageDashboardProps {
    dashboard: UserDashboard;
    onRefresh?: () => void; // Callback to refresh dashboard data
}

export function MarriageDashboard({ dashboard, onRefresh }: MarriageDashboardProps) {
    const { walletAddress } = useAuthStore();
    const [divorceState, setDivorceState] = useState<DivorceState>("idle");
    const [claimState, setClaimState] = useState<ClaimState>("idle");
    const [error, setError] = useState<string | null>(null);
    const [claimError, setClaimError] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    // Fetch detailed marriage information
    const { marriageView, isLoading: isMarriageLoading } = useMarriageDetails(
        dashboard.partner as `0x${string}` | null
    );

    // Calculate time together and next milestone
    const marriageStats = useMemo(() => {
        if (!marriageView) return null;

        const bondStartDate = new Date(Number(marriageView.bondStart) * 1000);
        const now = new Date();
        const msInDay = 1000 * 60 * 60 * 24;
        const msInYear = msInDay * 365.25;

        const daysTogether = Math.floor((now.getTime() - bondStartDate.getTime()) / msInDay);
        const yearsTogether = Math.floor((now.getTime() - bondStartDate.getTime()) / msInYear);

        const lastMilestone = Number(marriageView.lastMilestoneYear);
        const nextMilestone = lastMilestone + 1;

        // Calculate next anniversary date
        const nextAnniversary = new Date(bondStartDate);
        nextAnniversary.setFullYear(bondStartDate.getFullYear() + nextMilestone);
        const daysToAnniversary = Math.ceil((nextAnniversary.getTime() - now.getTime()) / msInDay);

        return {
            bondStartDate,
            daysTogether,
            yearsTogether,
            lastMilestone,
            nextMilestone,
            daysToAnniversary,
            marriageId: marriageView.marriageId,
        };
    }, [marriageView]);

    const handleClaim = async () => {
        if (!dashboard.partner || !walletAddress) {
            setClaimError("Missing partner or wallet information");
            return;
        }

        if (Number(dashboard.pendingYield) === 0) {
            setClaimError("No pending tokens to claim");
            return;
        }

        try {
            setClaimState("sending");
            setClaimError(null);

            const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
                transaction: [
                    {
                        address: CONTRACT_ADDRESSES.HUMAN_BOND,
                        abi: HUMAN_BOND_ABI,
                        functionName: "claimYield",
                        args: [dashboard.partner],
                    },
                ],
            });

            if (finalPayload.status === "error") {
                throw new Error("Claim transaction failed");
            }

            setClaimState("success");

            // Call callback to refresh dashboard
            if (onRefresh) {
                onRefresh();
            }
        } catch (err) {
            setClaimState("error");
            setClaimError(err instanceof Error ? err.message : "Failed to claim tokens");
        }
    };

    const handleDivorce = async () => {
        if (!dashboard.partner || !walletAddress) {
            setError("Missing partner or wallet information");
            return;
        }

        try {
            setDivorceState("sending");
            setError(null);

            const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
                transaction: [
                    {
                        address: CONTRACT_ADDRESSES.HUMAN_BOND,
                        abi: HUMAN_BOND_ABI,
                        functionName: "divorce",
                        args: [dashboard.partner],
                    },
                ],
            });

            if (finalPayload.status === "error") {
                throw new Error("Divorce transaction failed");
            }

            setDivorceState("success");
            // Don't close modal or refresh yet - wait for user to click Continue
            // setShowConfirm(false);
            // if (onRefresh) {
            //     onRefresh();
            // }
        } catch (err) {
            setDivorceState("error");
            setError(err instanceof Error ? err.message : "Failed to divorce");
        }
    };

    // Format TIME token balance (from wei to whole tokens)
    const timeBalance = Number(dashboard.timeBalance) / 1e18;
    const pendingYield = Number(dashboard.pendingYield) / 1e18;

    // Show loading state while fetching marriage details
    if (isMarriageLoading) {
        return (
            <div className="w-full max-w-2xl flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-black/70">Loading marriage details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl space-y-4">
            {/* Marriage Status Card */}
            <div className="bg-white rounded-3xl p-5  shadow-lg space-y-6">
                {/* Title */}
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-bold text-black">💒</h2>
                    <h3 className="text-2xl font-medium text-black">You are Married!</h3>
                    {marriageStats && (
                        <p className="text-sm text-gray-500">
                            {marriageStats.daysTogether} days together
                        </p>
                    )}
                </div>

                {/* Partner Info */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="text-sm text-gray-600 font-medium">Partner</span>
                        <span className="text-sm font-mono text-black">
                            {dashboard.partner.slice(0, 6)}...{dashboard.partner.slice(-4)}
                        </span>
                    </div>

                    {/* Marriage Date */}
                    {marriageStats && (
                        <div className="flex items-center justify-between p-4 bg-pink-50 rounded-2xl">
                            <span className="text-sm text-gray-600 font-medium">💝 Married Since</span>
                            <span className="text-sm text-pink-900 font-medium">
                                {marriageStats.bondStartDate.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                    )}



                    {/* TIME Token Balance */}
                    <div className="p-4 bg-amber-50 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between border-b border-amber-200 pb-2 mb-2">
                            <span className="text-sm text-gray-600 font-medium">Wallet Balance</span>
                            <div className="text-right">
                                <p className="text-lg font-bold text-amber-900">{timeBalance.toFixed(2)} TIME</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 font-medium">Pending Yield</span>
                            <div className="text-right">
                                <p className="text-md font-semibold text-amber-800">{pendingYield.toFixed(2)} TIME</p>
                            </div>
                        </div>

                        {/* Claim Button */}
                        {pendingYield > 0 && (
                            <button
                                onClick={handleClaim}
                                disabled={claimState === "sending"}
                                className="w-full py-2 px-4 rounded-full text-sm font-medium text-amber-900 bg-amber-200 hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {claimState === "sending" ? "Withdrawing..." : `Split & Withdraw ${pendingYield.toFixed(2)} TIME`}
                            </button>
                        )}

                        {/* Claim Success Message */}
                        {claimState === "success" && (
                            <p className="text-xs text-green-700 text-center">
                                ✅ Tokens claimed! Both partners received their share.
                            </p>
                        )}

                        {/* Claim Error Message */}
                        {claimError && (
                            <p className="text-xs text-red-700 text-center">{claimError}</p>
                        )}
                    </div>
                </div>

                {/* Divorce Section */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                    <button
                        onClick={() => window.location.href = '/marriage/gallery'}
                        className="w-full py-3 px-6 rounded-full text-sm font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors"
                    >
                        🖼️ View Memories
                    </button>
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="w-full py-3 px-6 rounded-full text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                        End Marriage
                    </button>
                </div>
            </div>

            {/* Next Milestone Card */}
            {marriageStats && marriageStats.daysToAnniversary > 0 && (
                <div className="bg-purple-50 rounded-2xl p-6 space-y-3 border-2 border-purple-200">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-purple-900">🏆 Next Milestone NFT</h4>
                        <span className="text-lg font-bold text-purple-900">
                            Year {marriageStats.nextMilestone}
                        </span>
                    </div>
                    {marriageStats.lastMilestone > 0 && (
                        <p className="text-xs text-purple-700">
                            Current: Year {marriageStats.lastMilestone} NFT ✅
                        </p>
                    )}
                    <p className="text-sm text-purple-600">
                        {marriageStats.daysToAnniversary} days until next anniversary
                    </p>
                </div>
            )}

            {/* Additional Info Card */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Marriage Details</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                        <span>🪙</span>
                        <span>Earn 1 TIME token per day together</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span>🎨</span>
                        <span>Both received unique Vow NFTs</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span>🏆</span>
                        <span>Unlock milestone NFTs on anniversaries</span>
                    </li>
                    {marriageStats && (
                        <li className="flex items-start gap-2">
                            <span>🔑</span>
                            <div className="flex-1">
                                <span className="text-xs text-gray-500">Marriage ID:</span>
                                <p className="text-xs font-mono text-gray-700 break-all mt-1">
                                    {marriageStats.marriageId}
                                </p>
                            </div>
                        </li>
                    )}
                </ul>
            </div>

            {/* Divorce Confirmation Popup */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => !divorceState.includes("sending") && divorceState !== "success" && setShowConfirm(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-3xl p-6 mx-4 max-w-sm w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
                        {/* Icon */}
                        <div className="text-center">
                            <span className="text-4xl">
                                {divorceState === "success" ? "👋" : "💔"}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-semibold text-gray-900 text-center">
                            {divorceState === "success" ? "Marriage Ended" : "End Marriage?"}
                        </h3>

                        {/* Description */}
                        {divorceState !== "success" ? (
                            <p className="text-sm text-gray-600 text-center">
                                Are you sure you want to end this marriage? Pending TIME tokens will be distributed to both partners.
                            </p>
                        ) : (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                                <p className="text-sm text-green-800 text-center">
                                    Marriage dissolved successfully. Tokens have been distributed.
                                </p>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-sm text-red-800 text-center">{error}</p>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            {divorceState === "success" ? (
                                <button
                                    onClick={() => {
                                        setShowConfirm(false);
                                        if (onRefresh) onRefresh();
                                    }}
                                    className="w-full py-3 px-4 rounded-full text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors"
                                >
                                    Continue
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        className="flex-1 py-3 px-4 rounded-full text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                        disabled={divorceState === "sending"}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDivorce}
                                        className="flex-1 py-3 px-4 rounded-full text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={divorceState === "sending"}
                                    >
                                        {divorceState === "sending" ? "Processing..." : "Confirm"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
