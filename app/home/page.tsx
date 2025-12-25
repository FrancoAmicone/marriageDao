/**
 * Purpose: Home page for Marriage DAO (Protected Route)
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
import { MarriageDashboard } from "../components/marriage/MarriageDashboard";
import {
  ShieldCheck,
  Heart,
  Send,
  Copy,
  Check,
  Sparkles,
  UserPlus,
  Users,
  Clock,
  ArrowRight
} from "lucide-react";

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
  const { marriageView, isLoading: isMarriageLoading } = useMarriageDetails(
    dashboard?.partner as `0x${string}` | null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

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
  const isMarried = isConnected && (dashboard?.isMarried ?? false);
  const hasIncomingProposals = isConnected && incomingProposals.length > 0;

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
  const isDataLoading = isConnected && (isDashboardLoading || isProposalsLoading || (dashboard?.isMarried && isMarriageLoading));

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
      <main className={`flex-1 flex flex-col items-center ${isMarried ? 'justify-start pt-1' : 'justify-center py-12'} px-6`}>
        {!isMarried ? (
          <div className="flex flex-col items-center text-center space-y-12 max-w-lg w-full">
            {/* Onchain Verification Badge */}
            {isConnected && address && (
              <div className="flex items-center gap-2.5 px-5 py-2.5 bg-white shadow-sm border border-emerald-100 rounded-full text-emerald-700 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping opacity-20" />
                  <ShieldCheck size={16} className="text-emerald-500 relative z-10" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Verified Human Identity</span>
                <div className="h-3 w-px bg-emerald-100 mx-1" />
                <span className="text-[10px] font-mono font-bold opacity-60">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
            )}

            {/* Incoming Proposals Notifications */}
            {hasIncomingProposals && (
              <div className="w-full bg-white rounded-[2.5rem] p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-rose-50 animate-in zoom-in duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                      <Heart size={24} className="fill-rose-500" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-black text-gray-900 tracking-tight">
                        {incomingProposals.length} Proposal{incomingProposals.length > 1 ? 's' : ''} Received
                      </h3>
                      <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Someone chose you</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {incomingProposals.map((proposal, index) => (
                    <div key={index} className="group relative bg-gray-50/50 hover:bg-rose-50/50 rounded-2xl p-4 transition-all duration-300 border border-transparent hover:border-rose-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 group-hover:text-rose-400 transition-colors">
                          <UserPlus size={18} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Proposer Address</p>
                          <p className="text-[11px] font-mono font-bold text-gray-900 truncate">
                            {proposal.proposer}
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(proposal.proposer)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-rose-500 group-hover:shadow-md transition-all active:scale-90 text-gray-400 hover:text-white"
                        >
                          {copiedAddress === proposal.proposer ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100/50 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase">
                          <Clock size={10} />
                          {new Date(Number(proposal.timestamp) * 1000).toLocaleDateString()}
                        </div>
                        <Link href="/marriage/accept" className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                          Review <ArrowRight size={10} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outgoing Pending Proposal Alert */}
            {hasPendingProposal && outgoingProposal && (
              <div className="w-full bg-[#1A1A1A] rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative overflow-hidden animate-in zoom-in duration-500">
                {/* Decoration */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 blur-[50px]" />

                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-amber-500">
                    <Send size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-black text-white tracking-tight">Proposal Sent</h3>
                    <p className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest">Waiting for response</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 relative z-10">
                  <div className="flex-1 text-left">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">To partner</p>
                    <p className="text-[11px] font-mono font-bold text-amber-100 truncate">
                      {outgoingProposal.proposed}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(outgoingProposal.proposed)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white text-gray-400 hover:text-black transition-all"
                  >
                    {copiedAddress === outgoingProposal.proposed ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>

                <p className="text-[10px] text-gray-500 font-medium leading-relaxed relative z-10 text-left px-1">
                  Your proposal is active on Worldchain. You cannot issue another until this one is accepted or canceled.
                </p>
              </div>
            )}

            {/* Hero Section */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.9] flex flex-col">
                {hasPendingProposal ? (
                  <span className="text-amber-500">Shared Destiny.</span>
                ) : hasIncomingProposals ? (
                  <span className="text-rose-500">Your Turn.</span>
                ) : (
                  <>
                    <span>Human</span>
                    <span className="text-pink-600">Bond.</span>
                  </>
                )}
              </h1>
              <p className="text-sm text-gray-500 font-medium max-w-[280px] mx-auto leading-relaxed">
                Certify your commitment on-chain. <br />Verified, eternal, and shared.
              </p>
            </div>

            {/* Main Action Buttons */}
            {isConnected ? (
              <div className="w-full flex flex-col gap-4">
                {hasPendingProposal ? (
                  <div className="w-full px-8 py-5 rounded-2xl bg-gray-100 text-gray-400 text-xs font-black uppercase tracking-[0.2em] cursor-not-allowed border border-gray-200">
                    Proposal in Progress
                  </div>
                ) : (
                  <Link
                    href="/marriage/create"
                    className="group w-full bg-black text-white px-8 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-gray-900 transition-all duration-300 shadow-xl shadow-gray-200 flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0"
                  >
                    <span>Make a Proposal</span>
                    <Sparkles size={16} className="text-amber-400 group-hover:rotate-12 transition-transform" />
                  </Link>
                )}

                <Link
                  href="/marriage/accept"
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
                isMarriageLoading={isMarriageLoading}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

