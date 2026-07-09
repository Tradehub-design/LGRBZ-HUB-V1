import type { LedgerRow, MemberContribution } from "./types";
import { round } from "@/utils/math";

const KNOWN_MEMBERS = ["Kieren Chan", "Sam Thomas", "Tom Flitcroft"];

export function calculateMemberContributions(rows: LedgerRow[]): MemberContribution[] {
  const map = new Map<string, MemberContribution>();

  for (const name of KNOWN_MEMBERS) {
    map.set(name, {
      name,
      depositsAud: 0,
      withdrawalsAud: 0,
      netAud: 0,
    });
  }

  for (const row of rows) {
    const memberName = findMemberName(row);
    if (!memberName) continue;

    const current =
      map.get(memberName) ??
      ({
        name: memberName,
        depositsAud: 0,
        withdrawalsAud: 0,
        netAud: 0,
      } satisfies MemberContribution);

    const amount = row.totalFeesIncludedAud || row.totalAud || row.price || 0;

    if (row.action === "Cash Deposit") {
      current.depositsAud += amount;
    }

    if (row.action === "Cash Withdrawal") {
      current.withdrawalsAud += amount;
    }

    current.netAud = current.depositsAud - current.withdrawalsAud;
    map.set(memberName, current);
  }

  return Array.from(map.values()).map((item) => ({
    ...item,
    depositsAud: round(item.depositsAud, 2),
    withdrawalsAud: round(item.withdrawalsAud, 2),
    netAud: round(item.netAud, 2),
  }));
}

function findMemberName(row: LedgerRow): string | null {
  const haystack = `${row.notes} ${row.strategy}`.toLowerCase();

  for (const member of KNOWN_MEMBERS) {
    if (haystack.includes(member.toLowerCase())) return member;
  }

  return null;
}
