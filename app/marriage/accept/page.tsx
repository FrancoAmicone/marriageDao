/**
 * Purpose: Accept Marriage Proposal page
 * Allows user to accept or reject a marriage proposal
 */

import { AcceptProposalForm } from "../../components/marriage/AcceptProposalForm";

export default function AcceptProposalPage() {
  return (
    <div className="min-h-screen bg-[#E8E8E8] flex flex-col">

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <AcceptProposalForm />
      </main>
    </div>
  );
}

