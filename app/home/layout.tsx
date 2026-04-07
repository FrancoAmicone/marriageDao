import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | HumanBond",
  description: "Create or accept a marriage proposal on Worldchain. Build your eternal bond.",
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
