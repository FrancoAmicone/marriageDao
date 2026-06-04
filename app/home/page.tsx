/**
 * Purpose: Home page for HumanBond (Protected Route)
 * Shows two options: Make a Proposal or Accept a Proposal
 * If user is already married, shows "You are already married" message
 * Requires World ID verification to access
 */

'use client'

import Link from "next/link";
import { useAuthStore } from "@/state/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWalletAuth } from "@/lib/worldcoin/useWalletAuth";
import { useUserDashboard } from "@/lib/worldcoin/useUserDashboard";
import { useProposals } from "@/lib/hooks/useProposals";
import { useMarriageDetails } from "@/lib/hooks/useMarriageDetails";
import { useActiveBondCount } from "@/lib/hooks/useActiveBondCount";
import { useCooldownStatus } from "@/lib/hooks/useCooldownStatus";
import { useNotificationPermission } from "@/lib/hooks/useNotificationPermission";
import {
  Heart,
  Send,
  Copy,
  Check,
  Sparkles,
  Users,
  Clock,
  ArrowRight,
  Coins,
  Image as ImageIcon,
  AlertTriangle,
  Timer,
  Link2,
  MessageCircle,
  Bell,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useWorldProfile, displayName, triggerDirectChat } from "@/lib/worldcoin/useWorldProfile";
import { isInWorldApp } from "@/lib/worldcoin/initMiniKit";
import { APP_URL, CONTRACT_ADDRESSES, HUMAN_BOND_ABI } from "@/lib/contracts";
import { MiniKit } from "@worldcoin/minikit-js";

const MarriageDashboard = dynamic(
  () => import("../components/marriage/MarriageDashboard").then(m => m.MarriageDashboard),
  { ssr: false }
);

// ---------------------------------------------------------------------------

export default function HomePage() {
  const router = useRouter();
  const { isVerified, checkVerificationExpiry, verificationData } = useAuthStore();
  const { isConnected, address } = useWalletAuth();
  const { dashboard, isLoading: isDashboardLoading, error: dashboardError, refetch } = useUserDashboard();
  const {
    incomingProposals,
    outgoingProposal,
    hasPendingProposal,
    isLoading: isProposalsLoading,
    refetch: refetchProposals
  } = useProposals();
  const { marriageView, dissolutionRequest, isLoading: isMarriageLoading } = useMarriageDetails(
    dashboard?.partner as `0x${string}` | null
  );
  const { count: activeBondCount } = useActiveBondCount();
  const { cooldown } = useCooldownStatus(address as `0x${string}` | null, dashboard?.isBonded);
  const { status: notifStatus, requestPermission } = useNotificationPermission();

  const [isLoading, setIsLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Live countdown for cooldown
  const [nowTs, setNowTs] = useState(Math.floor(Date.now() / 1000));
  useEffect(() => {
    if (!cooldown?.isActive) return;
    const id = setInterval(() => setNowTs(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, [cooldown?.isActive]);

  const cooldownRemaining = cooldown?.isActive
    ? Math.max(0, cooldown.cooldownEndsAt - nowTs)
    : 0;
  const cooldownDays = Math.floor(cooldownRemaining / 86400);
  const cooldownHours = Math.floor((cooldownRemaining % 86400) / 3600);
  const cooldownMinutes = Math.floor((cooldownRemaining % 3600) / 60);
  const isCooldownActive = cooldown?.isActive && cooldownRemaining > 0;
  const [showCancelProposalConfirm, setShowCancelProposalConfirm] = useState(false);
  const [cancelProposalState, setCancelProposalState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [cancelProposalError, setCancelProposalError] = useState<string | null>(null);
  const [localProposalCancelled, setLocalProposalCancelled] = useState(false);

  // Resolve outgoing partner username — only fires when there's a pending proposal
  const { profile: pendingPartnerProfile, isLoading: isPendingPartnerLoading } = useWorldProfile(
    outgoingProposal?.proposed ?? null
  );

  // Detect World App on client to conditionally show chat buttons
  const [isWorldApp, setIsWorldApp] = useState(false);
  useEffect(() => { setIsWorldApp(isInWorldApp()) }, []);

  const handleCancelProposal = async () => {
    try {
      setCancelProposalState("sending");
      setCancelProposalError(null);

      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [{
          address: CONTRACT_ADDRESSES.HUMAN_BOND,
          abi: HUMAN_BOND_ABI,
          functionName: "cancelProposal",
          args: [],
        }],
      });

      if (finalPayload.status === "error") throw new Error("Transaction failed");

      setCancelProposalState("success");
      setLocalProposalCancelled(true);
      refetch();
      refetchProposals();
    } catch (err) {
      setCancelProposalState("error");
      setCancelProposalError(err instanceof Error ? err.message : "Failed to cancel proposal");
    }
  };

  // Function to copy address to clipboard
  const copyToClipboard = async (walletAddress: string) => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopiedAddress(walletAddress);
      // Reset after 2 seconds
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  // Get marriage status from contract
  const isBonded = isConnected && (dashboard?.isBonded ?? false);
  const hasIncomingProposals = isConnected && incomingProposals.length > 0;
  const effectiveHasPendingProposal = hasPendingProposal && !localProposalCancelled;

  /**
   * Check if user is verified before showing content
   * Redirect to landing page if not verified
   */
  useEffect(() => {
    // Check verification status
    const isValid = checkVerificationExpiry();

    if (!isVerified || !isValid) {
      // Not verified or verification expired - redirect to landing
      router.replace("/");
      return;
    }

    // User is verified - show content
    setIsLoading(false);
  }, [isVerified, checkVerificationExpiry, router]);

  // Show loading state while checking verification or fetching dashboard
  // Include isMarriageLoading only if the user is potentially married to unify animations
  const isDataLoading = isConnected && (isDashboardLoading || isProposalsLoading || (dashboard?.isBonded && isMarriageLoading));

  if (isLoading || isDataLoading) {
    return (
      <div className="min-h-screen bg-[#E8E8E8] flex flex-col items-center justify-center p-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-black/5 rounded-full" />
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-black border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart size={24} className="text-black/20 animate-pulse" />
          </div>
        </div>
        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Synchronizing Bond Data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8E8E8] flex flex-col">
      {/* Main content - centered by default, top-aligned when married for 20px gap */}
      <main className={`flex-1 flex flex-col items-center justify-center px-6 py-8`}>
        {!isBonded ? (
          <div className="flex flex-col items-center text-center space-y-4 max-w-lg w-full">
            {/* Incoming Proposals — compact notification card */}
            {hasIncomingProposals && (
              <Link
                href="/marriage/proposals"
                className="w-full bg-white rounded-[2.5rem] p-6 flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-rose-50 animate-in zoom-in duration-500 hover:border-rose-100 transition-all group"
              >
                <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200 shrink-0">
                  <Heart size={22} className="fill-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-base font-black text-gray-900 tracking-tight">
                    {incomingProposals.length} Proposal{incomingProposals.length > 1 ? 's' : ''} Received
                  </h3>
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Tap to review</p>
                </div>
                <ArrowRight size={18} className="text-rose-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
              </Link>
            )}

            {/* Outgoing Pending Proposal Alert */}
            {effectiveHasPendingProposal && outgoingProposal && (
              <div className="w-full bg-[#1A1A1A] rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative overflow-hidden animate-in zoom-in duration-500">
                {/* Decoration */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 blur-[50px]" />

                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white">
                    <Send size={24} className="fill-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-black text-white tracking-tight">Proposal Sent</h3>
                    <p className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest">Waiting for response</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 relative z-10">
                  <div className="flex-1 text-left min-w-0 w-0">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">To partner</p>
                    {isPendingPartnerLoading ? (
                      <span className="block h-3 w-28 bg-white/10 rounded animate-pulse mt-1" />
                    ) : (
                      <p
                        className="text-[11px] font-mono font-bold text-amber-100 truncate overflow-hidden"
                        title={outgoingProposal.proposed}
                      >
                        {displayName(outgoingProposal.proposed, pendingPartnerProfile.username)}
                      </p>
                    )}
                  </div>
                  {/* Copy */}
                  <button
                    onClick={() => copyToClipboard(outgoingProposal.proposed)}
                    className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white text-gray-400 hover:text-black transition-all"
                  >
                    {copiedAddress === outgoingProposal.proposed ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  {/* Direct chat */}
                  {isWorldApp && (
                    <button
                      onClick={() => triggerDirectChat(pendingPartnerProfile.username ?? outgoingProposal.proposed)}
                      title="Message in World Chat"
                      className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white/10 hover:bg-amber-500 text-gray-400 hover:text-white transition-all"
                    >
                      <MessageCircle size={16} />
                    </button>
                  )}
                </div>

                <p className="text-[10px] text-gray-500 font-medium leading-relaxed relative z-10 text-left px-1">
                  Your proposal is active on Worldchain. You cannot issue another until this one is accepted or canceled.
                </p>

                <div className="flex justify-end relative z-10">
                  <button
                    onClick={() => setShowCancelProposalConfirm(true)}
                    className="text-[10px] font-black text-red-400/60 hover:text-red-400 uppercase tracking-widest transition-colors"
                  >
                    Cancel Proposal
                  </button>
                </div>
              </div>
            )}

            {/* Cooldown banner */}
            {isCooldownActive && (
              <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in duration-500">
                <Timer size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-black text-amber-800">Cooldown active</p>
                  <p className="text-[10px] text-amber-700 mt-0.5 flex items-center gap-1">
                    You can bond again in {cooldownDays}d {cooldownHours}h {cooldownMinutes}m
                  </p>
                </div>
              </div>
            )}

            {/* Hero Section */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.9] flex flex-col">
                {effectiveHasPendingProposal ? (
                  <span className="text-gray-9As00">Shared Destiny.</span>
                ) : hasIncomingProposals ? (
                  <span className="text-rose-500">Your Turn.</span>
                ) : (
                  <>
                    <span>Human</span>
                    <span className="text-balck-600">Bond.</span>
                  </>
                )}
              </h1>
              <p className="text-sm text-gray-500 font-medium max-w-[280px] mx-auto leading-relaxed">
                Certify your commitment on-chain. <br />Verified, eternal, and shared.
              </p>
              {activeBondCount > BigInt(0) && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/60 border border-gray-200/70 rounded-full text-gray-500 animate-in fade-in duration-700">
                  <Link2 size={11} className="text-gray-400" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em]">{activeBondCount.toString()} bonds on Worldchain</span>
                </div>
              )}
            </div>

            {/* Main Action Buttons */}
            {isConnected ? (
              <div className="w-full flex flex-col gap-4">
                {effectiveHasPendingProposal || isCooldownActive ? (
                  <div className="w-full px-8 py-5 rounded-2xl bg-gray-100 text-gray-400 text-xs font-black uppercase tracking-[0.2em] cursor-not-allowed border border-gray-200 text-center">
                    {effectiveHasPendingProposal ? "Proposal in Progress" : "Cooldown Active"}
                  </div>
                ) : (
                  <Link
                    href="/marriage/create"
                    className="group w-full bg-black text-white px-8 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-gray-900 transition-all duration-300 shadow-xl shadow-gray-200 flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0"
                  >
                    <span>Make a Proposal</span>
                    <Sparkles size={16} className="text-white group-hover:rotate-12 transition-transform" />
                  </Link>
                )}

                <Link
                  href="/marriage/proposals"
                  className="w-full bg-white text-black px-8 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border border-gray-100 hover:bg-gray-50 transition-all duration-300 shadow-sm flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0 relative"
                >
                  <Users size={16} className="text-gray-400" />
                  <span>Accept a Proposal</span>
                  {hasIncomingProposals && (
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black rounded-full h-6 w-6 flex items-center justify-center shadow-lg shadow-rose-200">
                      {incomingProposals.length}
                    </span>
                  )}
                </Link>

                <Link
                  href="/marriage/gallery"
                  className="w-full bg-white text-black px-8 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border border-gray-100 hover:bg-gray-50 transition-all duration-300 shadow-sm flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0"
                >
                  <ImageIcon size={16} className="text-gray-400" />
                  <span>My Gallery</span>
                </Link>

                {/* TIME balance from previous bond — subtle footer pill */}
                {dashboard && Number(dashboard.timeBalance) > 0 && (
                  <div className="mt-2 inline-flex self-center items-center gap-2 px-3.5 py-1.5 bg-white/60 border border-gray-200/70 rounded-full text-gray-500 animate-in fade-in duration-700">
                    <Coins size={11} className="text-amber-500/80" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em]">Time Collected</span>
                    <span className="text-[9px] font-mono font-bold text-gray-700">
                      {(Number(dashboard.timeBalance) / 1e18).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                {/* Notification opt-in — disappears once enabled */}
                {notifStatus === 'not_granted' && (
                  <button
                    onClick={requestPermission}
                    className="self-center flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Bell size={12} />
                    <span>Enable notifications</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-300 shadow-sm mb-2">
                  <Clock size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                  Connection Required to Proceed
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-lg mx-auto">
            {dashboard && isConnected && (
              <MarriageDashboard
                dashboard={dashboard}
                onRefresh={refetch}
                marriageView={marriageView}
                dissolutionRequest={dissolutionRequest}
                isMarriageLoading={isMarriageLoading}
              />
            )}
          </div>
        )}
      </main>

      {/* Cancel Proposal Confirm Modal */}
      {showCancelProposalConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => cancelProposalState !== "sending" && cancelProposalState !== "success" && setShowCancelProposalConfirm(false)}
          />
          <div className="relative bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                cancelProposalState === "success" ? "bg-emerald-50 text-emerald-500" : "bg-amber-50 text-amber-500"
              }`}>
                {cancelProposalState === "success" ? <Sparkles size={40} /> : <AlertTriangle size={40} />}
              </div>
            </div>

            <div className="text-center space-y-2">
              {cancelProposalState === "success" ? (
                <>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Proposal Cancelled</h3>
                  <p className="text-sm text-emerald-600 font-bold">You can make a new proposal anytime.</p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Cancel Proposal?</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    This will withdraw your proposal from Worldchain. Your partner will no longer be able to accept it.
                  </p>
                </>
              )}
            </div>

            {cancelProposalError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                <p className="text-xs font-bold text-red-600 text-center uppercase tracking-wider">{cancelProposalError}</p>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              {cancelProposalState === "success" ? (
                <button
                  onClick={() => {
                    setShowCancelProposalConfirm(false);
                    setCancelProposalState("idle");
                  }}
                  className="w-full py-4 px-6 rounded-2xl text-sm font-black text-white bg-gray-900 hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
                >
                  Done
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancelProposal}
                    disabled={cancelProposalState === "sending"}
                    className="w-full py-4 px-6 rounded-2xl text-sm font-black text-white bg-red-500 hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-200 disabled:opacity-50"
                  >
                    {cancelProposalState === "sending" ? "Processing..." : "Yes, Cancel It"}
                  </button>
                  <button
                    onClick={() => setShowCancelProposalConfirm(false)}
                    disabled={cancelProposalState === "sending"}
                    className="w-full py-4 px-6 rounded-2xl text-sm font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Keep waiting
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

