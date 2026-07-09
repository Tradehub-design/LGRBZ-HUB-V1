"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import {
  Workspace,
  WorkspaceHeader,
  WorkspacePanel,
} from "@/components/workspace";

import { searchWorkspace } from "@/lib/search/globalSearch";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchWorkspace(query), [query]);

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Workspace"
        title="Global Search"
        description="Search every workspace inside LGRBZ."
      />

      <WorkspacePanel title="Search">

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="mb-6 w-full rounded-xl border border-[#173047] bg-[#071827] px-4 py-3 text-white"
        />

        <div className="space-y-3">

          {results.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block rounded-xl border border-[#173047] bg-[#0b1e30] p-4 hover:border-sky-500"
            >
              <div className="flex items-center gap-3">

                <Search size={18} />

                <div>

                  <p className="font-semibold text-white">
                    {item.title}
                  </p>

                  <p className="text-sm text-slate-400">
                    {item.description}
                  </p>

                </div>

              </div>

            </Link>
          ))}

        </div>

      </WorkspacePanel>

    </Workspace>
  );
}
