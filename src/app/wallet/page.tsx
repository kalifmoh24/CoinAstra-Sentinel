import { redirect } from "next/navigation";

/** Alias: /wallet → /scan/wallet */
export default function WalletAliasPage() {
  redirect("/scan/wallet");
}
