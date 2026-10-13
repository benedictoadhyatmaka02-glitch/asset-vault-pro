import type { ReactNode } from "react";
import { useVault } from "@/lib/vault";
import { Card, WalletButton } from "./ui-kit";

export function RequireWallet({ children }: { children: ReactNode }) {
  const { wallet } = useVault();
  if (!wallet)
    return (
      <Card className="mx-auto mt-16 max-w-md text-center">
        <h2 className="text-xl font-bold">Hubungkan wallet dulu</h2>
        <p className="mb-5 mt-2 text-sm text-muted-foreground">Simulasi koneksi. Kami tidak pernah meminta private key atau seed phrase.</p>
        <WalletButton />
      </Card>
    );
  return <>{children}</>;
}
