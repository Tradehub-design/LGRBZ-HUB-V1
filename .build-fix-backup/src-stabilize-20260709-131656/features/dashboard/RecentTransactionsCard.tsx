import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const transactions = [
  { id: 1, name: "VAS Dividend", type: "Dividend", amount: "+$0.00" },
  { id: 2, name: "NDQ Buy", type: "Buy", amount: "$0.00" },
  { id: 3, name: "Cash Interest", type: "Interest", amount: "+$0.00" },
];

export function RecentTransactionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-medium">{transaction.name}</p>
                <p className="text-sm text-muted-foreground">{transaction.type}</p>
              </div>

              <p className="font-semibold">{transaction.amount}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}