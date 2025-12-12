/**
 * Purpose: Create Marriage Proposal page
 * Allows user to create a marriage proposal to another wallet address
 */

'use client'

import { Header } from "../../components/Header";
import { CreateProposalForm } from "../../components/marriage/CreateProposalForm";
import { useProposals } from "@/lib/hooks/useProposals";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateProposalPage() {
  const { hasPendingProposal, isLoading } = useProposals();
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  // Check if user already has a pending proposal
  useEffect(() => {
    if (!isLoading) {
      if (hasPendingProposal) {
        // Redirect back to home if user already has a proposal
        router.replace("/home");
        return;
      }
      setShowContent(true);
    }
  }, [hasPendingProposal, isLoading, router]);

  // Show loading while checking
  if (isLoading || !showContent) {
    return (
      <div className="min-h-screen bg-[#E8E8E8] flex flex-col">
        <Header />
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
      {/* Header with logo and wallet address */}
      <Header />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <CreateProposalForm />
      </main>
    </div>
  );
}
