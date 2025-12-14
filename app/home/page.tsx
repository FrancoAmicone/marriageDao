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
import { MarriageDashboard } from "../components/marriage/MarriageDashboard";

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
  const [isLoading, setIsLoading] = useState(true);

  // Get marriage status from contract
  const isMarried = isConnected && (dashboard?.isMarried ?? false);
  const hasIncomingProposals = isConnected && incomingProposals.length > 0;

  // Debug: Log connection state
  useEffect(() => {
    console.log('🔍 Home Page - Wallet State:', { isConnected, address })
  }, [isConnected, address])

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
  if (isLoading || (isConnected && (isDashboardLoading || isProposalsLoading))) {
    return (
      <div className="min-h-screen bg-[#E8E8E8] flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-black/70">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8E8E8] flex flex-col">

      {/* Main content - centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {!isMarried ? (
          <div className="flex flex-col items-center text-center space-y-8 max-w-md w-full">
            {/* Onchain Verification Badge */}
            {isConnected && address && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-400 rounded-full text-blue-700 text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span>Verified Onchain</span>
                <span className="text-xs opacity-70 font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
              )}

            {/* Incoming Proposals Notifications */}
            {hasIncomingProposals && (
              <div className="w-full bg-rose-50 border-2 border-rose-300 rounded-2xl p-6 space-y-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">💝</span>
                  <h3 className="text-xl font-medium text-rose-900">
                    {incomingProposals.length} Proposal{incomingProposals.length > 1 ? 's' : ''} Received!
                  </h3>
                </div>
                <p className="text-sm text-rose-800 font-medium">
                  Someone wants to marry you! Check the proposals below.
                </p>
                <div className="space-y-2 mt-4">
                  {incomingProposals.map((proposal, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-rose-200">
                      <p className="text-xs text-rose-600 font-semibold mb-1">From:</p>
                      <p className="text-xs font-mono text-rose-900 break-all">
                        {proposal.proposer}
                      </p>
                      <p className="text-xs text-rose-500 mt-2">
                        {new Date(Number(proposal.timestamp) * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
            </div>
            )}

            {/* Outgoing Pending Proposal Alert */}
            {hasPendingProposal && outgoingProposal && (
              <div className="w-full bg-amber-50 border border-amber-300 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💍</span>
                  <h3 className="text-lg font-medium text-amber-900">Pending Proposal</h3>
                </div>
                <p className="text-sm text-amber-800">
                  You have already proposed to:
                </p>
                <p className="text-xs font-mono bg-amber-100 p-2 rounded-lg text-amber-900 break-all">
                  {outgoingProposal.proposed}
                </p>
                <p className="text-xs text-amber-700">
                  Waiting for them to accept your proposal. You cannot make another proposal until this one is resolved.
                </p>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-normal text-black tracking-tight">
              {hasPendingProposal ? "Proposal Sent!" : hasIncomingProposals ? "You Have Proposals!" : "Time to get Married"}
            </h1>

            {/* Button Container - Only show if wallet is connected */}
            {isConnected ? (
              <div className="bg-[#C4C4C4] rounded-3xl p-8 w-full space-y-4">
                {/* Make a Proposal Button */}
                {hasPendingProposal ? (
                  <div className="w-full bg-gray-400 text-white px-8 py-4 rounded-full text-lg font-normal opacity-50 cursor-not-allowed text-center">
                    Make a Proposal
                  </div>
                ) : (
                  <Link
                    href="/marriage/create"
                    className="block w-full bg-black text-white px-8 py-4 rounded-full text-lg font-normal hover:bg-black/90 transition-all duration-200"
                  >
                    Make a Proposal
                  </Link>
                )}

                {/* Accept a Proposal Button with notification badge */}
                <Link
                  href="/marriage/accept"
                  className="block w-full bg-black text-white px-8 py-4 rounded-full text-lg font-normal hover:bg-black/90 transition-all duration-200 relative"
                >
                  Accept a Proposal
                  {hasIncomingProposals && (
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
                      {incomingProposals.length}
                    </span>
                  )}
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-black/60 text-base">
                  Connect your wallet to continue
                </p>
                <p className="text-black/40 text-sm">
                  👆 Use the button in the top right
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            {/* Marriage Dashboard */}
            {dashboard && isConnected && <MarriageDashboard dashboard={dashboard} onRefresh={refetch} />}
          </div>
        )}
      </main>
    </div>
  );
}

