import type { Metadata } from "next";
import { AcceptProposalForm } from "../../components/marriage/AcceptProposalForm";

export const metadata: Metadata = {
  title: "Accept Proposal | HumanBond",
  description: "Accept a marriage proposal and create an eternal bond on Worldchain.",
};

export default function AcceptProposalPage() {
  return (
    <div className="min-h-screen bg-[#E8E8E8] flex flex-col">

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-start px-6">
        <AcceptProposalForm />
      </main>
    </div>
  );
}

