"use client";

import {
  DividendCentreRouteBridge,
} from "@/components/dividend-centre-v2";

export default function DividendsPage() {
  /*
   * Dividend Centre 2.0 route.
   *
   * The presentation and data engines are now installed.
   * Bash 5 connects the overall Dashboard and shared live
   * portfolio source so holdings and transaction data flow
   * automatically into this route.
   *
   * Until that connection is installed, the route displays
   * the professional empty state instead of mock dividend data.
   */

  return (
    <DividendCentreRouteBridge />
  );
}
