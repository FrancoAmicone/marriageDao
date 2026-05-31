'use client'

import { CreateProposalForm } from "../../components/marriage/CreateProposalForm";
import { useProposals } from "@/lib/hooks/useProposals";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

export default function CreateProposalPage() {
  const { hasPendingProposal, isLoading } = useProposals();
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (hasPendingProposal) {
        router.replace("/home");
        return;
      }
      setShowContent(true);
    }
  }, [hasPendingProposal, isLoading, router]);

  if (isLoading || !showContent) {
    return (
      <div className="min-h-screen bg-[#E8E8E8] flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black mx-auto" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8E8E8] flex flex-col">
      {/* Sticky header */}
      <div className="bg-[#E8E8E8]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push("/home")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 hover:text-black hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <h1 className="font-black text-xl text-gray-900 tracking-tight">New Proposal</h1>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-start px-6 py-5">
        <CreateProposalForm />
      </main>
    </div>
  );
}
