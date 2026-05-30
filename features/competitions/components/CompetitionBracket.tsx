"use client";

import {
  Bracket,
  BracketGame,
  Model,
} from "react-tournament-bracket";

import { BracketMatch } from "../types";

type CompetitionBracketProps = {
  matches: BracketMatch[];
};

export function CompetitionBracket({ matches }: CompetitionBracketProps) {
  const { games, finalGame } = toBracketGames(matches);

  return (
    <div className="overflow-auto rounded-2xl border border-zinc-200 bg-white p-4">
      {finalGame ? (
        <Bracket game={finalGame} GameComponent={BracketGame} />
      ) : (
        <div className="text-center text-sm text-zinc-500">
          Chaveamento indisponivel.
        </div>
      )}
    </div>
  );
}

function toBracketGames(matches: BracketMatch[]): {
  games: Model.Game[];
  finalGame: Model.Game | null;
} {
  const games = matches.map((match) => {
    const [home, visitor] = match.participants;
    return {
      id: String(match.id),
      name: match.name,
      scheduled: Date.parse(match.startTime) || Date.now(),
      sides: {
        home: toSideInfo(home),
        visitor: toSideInfo(visitor),
      },
    } satisfies Model.Game;
  });

  const gamesById = new Map<string, Model.Game>(
    games.map((game) => [game.id, game])
  );

  matches.forEach((match) => {
    if (match.nextMatchId === null) {
      return;
    }

    const sourceGame = gamesById.get(String(match.id));
    const targetGame = gamesById.get(String(match.nextMatchId));

    if (!sourceGame || !targetGame) {
      return;
    }

    const winner =
      match.participants.find((participant) => participant?.isWinner) ??
      match.participants[0];

    const seed: Model.SideInfo["seed"] = {
      displayName: winner?.name ?? sourceGame.name,
      rank: 1,
      sourceGame,
      sourcePool: {},
    };

    if (!targetGame.sides.home.seed) {
      targetGame.sides.home = { ...targetGame.sides.home, seed };
    } else if (!targetGame.sides.visitor.seed) {
      targetGame.sides.visitor = { ...targetGame.sides.visitor, seed };
    }
  });

  const finalMatch = matches.find((match) => match.nextMatchId === null);
  const finalGame = finalMatch
    ? gamesById.get(String(finalMatch.id)) ?? null
    : null;

  return { games, finalGame };
}

function toSideInfo(participant?: BracketMatch["participants"][number]): Model.SideInfo {
  if (!participant) {
    return { seed: null } as unknown as Model.SideInfo;
  }

  const parsedScore = participant.resultText
    ? Number.parseInt(participant.resultText, 10)
    : null;

  return {
    seed: null,
    team: {
      id: participant.id,
      name: participant.name,
    },
    score: Number.isNaN(parsedScore) || parsedScore === null
      ? undefined
      : { score: parsedScore },
  } as unknown as Model.SideInfo;
}
