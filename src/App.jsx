import { useState } from "react";
import Keyboard from "./components/Keyboard";
import Board from "./components/Board";
import Results from "./components/Results";

export default function App() {
  const [game, setGame] = useState({
    players: [
      { name: "Joueur 1", score: 301 },
      { name: "Joueur 2", score: 301 },
    ],
    turns: [
      {
        playerIndex: 0,
        hits: [],
      },
    ],
  });

  function formatMultiplierLabel(label) {
    switch (label) {
      case "Double":
        return "D";
      case "Triple":
        return "T";
    }
  }

  function handleSelectKey(key) {
    setGame((prevGame) => {
      let gameUpdated = { ...prevGame };
      const MULTIPLIER_KEYS = ["Double", "Triple"];
      let currentHit = MULTIPLIER_KEYS.includes(key)
        ? formatMultiplierLabel(key)
        : key;
      let currentHitScore = MULTIPLIER_KEYS.includes(key) ? 0 : Number(currentHit);
      let lastTurn = gameUpdated.turns[gameUpdated.turns.length - 1];
      let lastHit = lastTurn.hits[lastTurn.hits.length - 1] ?? null;
      let totalPlayerScore = gameUpdated.players[lastTurn.playerIndex].score;
      console.log(lastHit);

      // manage hit score with double or triple
      if (lastHit !== null && ["D", "T"].includes(lastHit.label)) {
        // remove multiplier if selected twice in a row
        if (lastHit.label === currentHit) {
          lastTurn.hits.pop();
          currentHit = null;
          gameUpdated.turns[gameUpdated.turns.length - 1] = lastTurn;
        } else {
          switch (lastHit.label) {
            case "D":
              currentHitScore = currentHit * 2;
              break;
            case "T":
              currentHitScore = currentHit * 3;
              break;
          }

          lastTurn.hits[lastTurn.hits.length - 1] = {
            label: lastHit.label + currentHit,
            score: currentHitScore,
          };
        }

        totalPlayerScore = updateTotalPlayerScore(
          prevGame.players[lastTurn.playerIndex].score,
          currentHitScore
        );
        gameUpdated.players[lastTurn.playerIndex].score = totalPlayerScore;

        if (totalPlayerScore === 0) {
        } else if (isTotalPlayerScoreLowerThanZero(totalPlayerScore)) {
          gameUpdated = resetPlayerScore(gameUpdated, lastTurn);
          gameUpdated = switchPlayer(gameUpdated, lastTurn.playerIndex ? 0 : 1);
        }

        return gameUpdated;
      }

      if (lastTurn.hits.length >= 3) {
        const nextPlayerIndex = lastTurn.playerIndex ? 0 : 1;

        gameUpdated = switchPlayer(gameUpdated, nextPlayerIndex, {
          label: currentHit,
          score: currentHitScore,
        });
        lastTurn = gameUpdated.turns[gameUpdated.turns.length - 1];
        totalPlayerScore = updateTotalPlayerScore(
          prevGame.players[nextPlayerIndex].score,
          currentHitScore
        );
        gameUpdated.players[nextPlayerIndex].score = totalPlayerScore;
      } else {
        if (currentHit !== null) {
          lastTurn.hits.push({ label: currentHit, score: currentHitScore });
        }

        totalPlayerScore = updateTotalPlayerScore(
          prevGame.players[lastTurn.playerIndex].score,
          currentHitScore
        );
        gameUpdated.players[lastTurn.playerIndex].score = totalPlayerScore;
      }

      // player must finish with a hit on double/triple area
      if (
        totalPlayerScore === 0 ||
        isTotalPlayerScoreLowerThanZero(totalPlayerScore)
      ) {
        console.log("problem");
        gameUpdated = resetPlayerScore(gameUpdated, lastTurn);
        gameUpdated = switchPlayer(gameUpdated, lastTurn.playerIndex ? 0 : 1);
      }

      console.log(gameUpdated);

      return gameUpdated;
    });
  }

  function updateTotalPlayerScore(currentTotalPlayerScore, currentHitScore) {
    return currentTotalPlayerScore - currentHitScore;
  }

  function isTotalPlayerScoreLowerThanZero(totalPlayerScore) {
    return totalPlayerScore < 0;
  }

  function resetPlayerScore(game, lastTurn) {
    const totalTurnScore = lastTurn.hits.reduce(
      (accumulator, currentValue) => accumulator + currentValue.score,
      0
    );
    console.log(game.players[lastTurn.playerIndex].score, totalTurnScore);
    game.players[lastTurn.playerIndex].score =
      game.players[lastTurn.playerIndex].score + totalTurnScore;

    return game;
  }

  function switchPlayer(game, playerIndex, firstHit = null) {
    game.turns.push({
      playerIndex: playerIndex,
      hits: firstHit !== null ? [firstHit] : [],
    });

    return game;
  }

  const winner = game.players.find((player) => player.score === 0) ?? null;

  return (
    <div className="h-screen overflow-hidden flex flex-col justify-between items-center w-full sm:p-4 md:flex-row md:justify-center md:gap-16 lg:p-12">
      {winner !== null ? (
        <Results players={game.players} />
      ) : (
        <Board game={game} />
      )}
      <Keyboard onSelectKey={handleSelectKey} />
    </div>
  );
}
