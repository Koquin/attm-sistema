"use client";

import { useState } from "react";

import { AthletesTable } from "../components/AthletesTable";
import { CompetitionBracket } from "../components/CompetitionBracket";
import { CompetitionTabs } from "../components/CompetitionTabs";
import { GroupMatchesTable } from "../components/GroupMatchesTable";
import { MatchesList } from "../components/MatchesList";
import type { Competition, CompetitionDetails } from "../types";

type CompetitionDetailsViewProps = {
  competition: Competition;
  details: CompetitionDetails;
};

const tabs = [
  { key: "athletes", label: "Atletas inscritos" },
  { key: "groups", label: "Fase de grupos" },
  { key: "bracket", label: "Chaveamentos" },
  { key: "games", label: "Jogos" },
];

export function CompetitionDetailsView({
  competition,
  details,
}: CompetitionDetailsViewProps) {
  const [activeTab, setActiveTab] = useState("athletes");

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Competicao
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">
          {competition.name}
        </h1>
        <div className="mt-4 grid gap-2 text-sm text-zinc-600 sm:grid-cols-2">
          <p>Categoria: {competition.category}</p>
          <p>Modalidade: {competition.modality}</p>
          <p>Status: {competition.status}</p>
          <p>Grupos: {competition.groupCount}</p>
          <p>Partidas: {competition.matchCount}</p>
          <p>Criada em: {competition.createdAt}</p>
        </div>
        <p className="mt-4 text-sm text-zinc-600">{details.about}</p>
      </header>

      <div className="mt-8">
        <CompetitionTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div className="mt-6">
        {activeTab === "athletes" && (
          <AthletesTable athletes={details.athletes} />
        )}
        {activeTab === "groups" && (
          <GroupMatchesTable matches={details.groupMatches} />
        )}
        {activeTab === "bracket" && (
          <CompetitionBracket matches={details.bracketMatches} />
        )}
        {activeTab === "games" && <MatchesList games={details.games} />}
      </div>
    </div>
  );
}
