/**
 * Marriage Dashboard Component
 * Displays marriage information when user is bonded
 * Shows partner, TIME tokens, and divorce option
 */

"use client";

import { useState, useMemo, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import { CONTRACT_ADDRESSES, HUMAN_BOND_ABI } from "@/lib/contracts";
import { useAuthStore } from "@/state/authStore";
import { UserDashboard } from "@/lib/worldcoin/useUserDashboard";
import { useMarriageDetails } from "@/lib/hooks/useMarriageDetails";
import {
    Coins,
    TrendingUp,
    HandHeart,
    Calendar,
    Image as ImageIcon,
    Heart,
    Clock,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { MarriageView } from "@/lib/hooks/useMarriageDetails";

type DivorceState = "idle" | "sending" | "success" | "error";
type ClaimState = "idle" | "sending" | "success" | "error";

interface MarriageDashboardProps {
    dashboard: UserDashboard;
    onRefresh?: () => void; // Callback to refresh dashboard data
    marriageView?: MarriageView | null;
    isMarriageLoading?: boolean;
}

export function MarriageDashboard({
    dashboard,
    onRefresh,
    marriageView: propsMarriageView,
    isMarriageLoading: propsIsMarriageLoading
}: MarriageDashboardProps) {
    const { walletAddress } = useAuthStore();
    const [divorceState, setDivorceState] = useState<DivorceState>("idle");
    const [claimState, setClaimState] = useState<ClaimState>("idle");
    const [error, setError] = useState<string | null>(null);
    const [claimError, setClaimError] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    // Fetch detailed marriage information
    const { marriageView: internalMarriageView, isLoading: internalIsMarriageLoading } = useMarriageDetails(
        !propsMarriageView ? (dashboard.partner as `0x${string}` | null) : null
    );

    const marriageView = propsMarriageView || internalMarriageView;
    const isMarriageLoading = propsIsMarriageLoading ?? internalIsMarriageLoading;

    // Real-time interpolated pending yield
    const [interpolatedYield, setInterpolatedYield] = useState<number>(0);

    // Calculate time together and next milestone
    const marriageStats = useMemo(() => {
        if (!marriageView) return null;

        const bondStartDate = new Date(Number(marriageView.bondStart) * 1000);
        const lastClaimDate = new Date(Number(marriageView.lastClaim) * 1000);
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
            lastClaimDate,
            daysTogether,
            yearsTogether,
            lastMilestone,
            nextMilestone,
            daysToAnniversary,
            marriageId: marriageView.marriageId,
        };
    }, [marriageView]);

    // Real-time interpolation effect
    useEffect(() => {
        if (!marriageView) return;

        const interval = setInterval(() => {
            const now = Date.now() / 1000;
            const lastClaim = Number(marriageView.lastClaim);
            const secondsSinceClaim = now - lastClaim;

            // 1 TIME token per day = 1 / 86400 tokens per second
            const currentYield = Math.max(0, secondsSinceClaim * (1 / 86400));
            setInterpolatedYield(currentYield);
        }, 100); // Update every 100ms for smooth animation

        return () => clearInterval(interval);
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

    // Show loading state while fetching marriage details - only if not handled by parent
    if (isMarriageLoading && !propsMarriageView) {
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
        <div className="w-full max-w-2xl space-y-6">
            {/* Marriage Status Card */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 space-y-8 relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-10 right-0 p-4 opacity-[0.03]">
                    <Heart size={120} className="text-pink-600 rotate-12" />
                </div>

                {/* Header Section */}
                <div className="text-center space-y-3 relative">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-50 rounded-full mb-2">
                        <Heart className="text-pink-500 fill-pink-500" size={40} />
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight text-gray-900">You are Married!</h3>
                    {marriageStats && (
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                            <Calendar size={16} />
                            <span className="text-sm font-medium">{marriageStats.daysTogether} days of shared life</span>
                        </div>
                    )}
                </div>

                {/* Partner Info Mini Card */}
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between group hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <HandHeart size={20} className="text-gray-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Partner</p>
                            <p className="text-sm font-mono font-medium text-gray-700">
                                {dashboard.partner.slice(0, 8)}...{dashboard.partner.slice(-6)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Shared Wealth Section - THE CORE REDESIGN */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Sparkles size={18} className="text-amber-500" />
                        <h4 className="text-base font-bold text-gray-800">Shared Wealth</h4>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Wallet Balance Card */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-5 border border-amber-100/50 shadow-sm relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Coins size={100} className="text-amber-600" />
                            </div>

                            <div className="relative space-y-1">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700/70">Harvested Time</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-amber-900 tracking-tighter">
                                        {timeBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-lg font-bold text-amber-700">TIME</span>
                                </div>
                                <p className="text-xs text-amber-700/60 font-medium">Available in your wallet</p>
                            </div>
                        </div>

                        {/* Growing Future Card */}
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">Growing Future</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">
                                            {interpolatedYield.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                                        </span>
                                        <span className="text-lg font-bold text-gray-400">TIME</span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center animate-pulse">
                                    <TrendingUp size={24} className="text-emerald-500" />
                                </div>
                            </div>

                            {/* Progress Bar for the day */}
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-linear"
                                        style={{ width: `${(interpolatedYield % 1) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1">
                                    <span>HARVESTING...</span>
                                    <span>+1.00 TIME / DAY</span>
                                </div>
                            </div>

                            {/* Withdraw Section */}
                            {pendingYield > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-50">
                                    <button
                                        onClick={handleClaim}
                                        disabled={claimState === "sending"}
                                        className="w-full py-4 px-6 rounded-2xl text-sm font-bold text-white bg-gray-900 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                                    >
                                        {claimState === "sending" ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Withdrawing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Coins size={18} />
                                                <span>Withdraw Joint Yield</span>
                                            </>
                                        )}
                                    </button>

                                    {claimState === "success" && (
                                        <div className="mt-3 py-2 px-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                            <Sparkles size={14} className="text-emerald-500" />
                                            <p className="text-[11px] font-semibold text-emerald-700">
                                                Tokens claimed successfully! Divided between both partners.
                                            </p>
                                        </div>
                                    )}

                                    {claimError && (
                                        <p className="mt-2 text-center text-[10px] font-medium text-red-500">{claimError}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                    <button
                        onClick={() => window.location.href = '/marriage/gallery'}
                        className="w-full py-4 px-6 rounded-2xl text-sm font-bold text-gray-700 bg-white border-2 border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                                <ImageIcon size={18} className="text-gray-500 group-hover:text-amber-600" />
                            </span>
                            <span>View Memories & Gallery</span>
                        </div>
                        <ChevronRight size={18} className="text-gray-300" />
                    </button>

                    <button
                        onClick={() => setShowConfirm(true)}
                        className="w-full py-3 text-xs font-bold text-red-400 hover:text-red-500 transition-colors uppercase tracking-widest h-12"
                    >
                        Dissolve Bond
                    </button>
                </div>
            </div>

            {/* Next Milestone Card */}
            {marriageStats && (
                <div className="bg-[#1A1A1A] rounded-[2rem] p-6 space-y-4 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 blur-[60px]" />

                    <div className="flex items-center justify-between relative">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Sparkles className="text-purple-400" size={14} />
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">Next Milestone</h4>
                            </div>
                            <p className="text-2xl font-black text-white">Year {marriageStats.nextMilestone} NFT</p>
                        </div>
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                            <Sparkles size={24} className="text-purple-300" />
                        </div>
                    </div>

                    <div className="space-y-3 relative">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-400">Time remaining</p>
                                <p className="text-lg font-bold text-white tabular-nums">
                                    {marriageStats.daysToAnniversary} <span className="text-gray-500 font-medium text-sm">Days</span>
                                </p>
                            </div>
                            {marriageStats.lastMilestone > 0 && (
                                <div className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full font-bold border border-emerald-500/20">
                                    YEAR {marriageStats.lastMilestone} COLLECTED
                                </div>
                            )}
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                                style={{ width: `${100 - (marriageStats.daysToAnniversary / 365.25 * 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Additional Info Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-3">
                    <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
                        <Coins size={16} className="text-amber-500" />
                    </div>
                    <p className="text-xs font-bold text-gray-800 leading-tight">Shared<br />1 TIME / Day</p>
                </div>
                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-3">
                    <div className="w-8 h-8 bg-pink-50 rounded-xl flex items-center justify-center">
                        <Heart size={16} className="text-pink-500" />
                    </div>
                    <p className="text-xs font-bold text-gray-800 leading-tight">Unique<br />Vow NFTs</p>
                </div>
            </div>

            {/* Marriage ID Footer */}
            {marriageStats && (
                <div className="px-6 py-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Marriage ID</span>
                    </div>
                    <p className="text-[10px] font-mono text-gray-400 truncate max-w-[150px]">
                        {marriageStats.marriageId}
                    </p>
                </div>
            )}

            {/* Divorce Confirmation Popup */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
                        onClick={() => !divorceState.includes("sending") && divorceState !== "success" && setShowConfirm(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl space-y-6 animate-in fade-in zoom-in duration-300">
                        {/* Status Icon */}
                        <div className="flex justify-center">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${divorceState === "success" ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"}`}>
                                {divorceState === "success" ? <Sparkles size={40} /> : <Heart size={40} className="fill-red-500" />}
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                                {divorceState === "success" ? "Bond Dissolved" : "End the Bond?"}
                            </h3>

                            {divorceState !== "success" ? (
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                    Are you sure? This will end your daily rewards and distribute all pending TIME tokens to both wallets.
                                </p>
                            ) : (
                                <p className="text-sm text-emerald-600 font-bold">
                                    Freedom found. Your shared wealth has been harvested and distributed.
                                </p>
                            )}
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                                <p className="text-xs font-bold text-red-600 text-center uppercase tracking-wider">{error}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 pt-2">
                            {divorceState === "success" ? (
                                <button
                                    onClick={() => {
                                        setShowConfirm(false);
                                        if (onRefresh) onRefresh();
                                    }}
                                    className="w-full py-4 px-6 rounded-2xl text-sm font-black text-white bg-gray-900 hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
                                >
                                    Return to Home
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleDivorce}
                                        disabled={divorceState === "sending"}
                                        className="w-full py-4 px-6 rounded-2xl text-sm font-black text-white bg-red-500 hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-200 disabled:opacity-50"
                                    >
                                        {divorceState === "sending" ? "Processing..." : "Confirm Dissolution"}
                                    </button>
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        disabled={divorceState === "sending"}
                                        className="w-full py-4 px-6 rounded-2xl text-sm font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
                                    >
                                        Keep the bond
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
