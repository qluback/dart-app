// import {
//   FaArrowUpLong,
//   FaClock,
//   FaCloudShowersHeavy,
//   FaDroplet,
//   FaMagnifyingGlass,
//   FaSun,
//   FaWater,
//   FaWind,
// } from "react-icons/fa6";

import { useState } from "react";
import Keyboard from "./components/Keyboard";
import Board from "./components/Board";

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
      let hit = MULTIPLIER_KEYS.includes(key)
        ? formatMultiplierLabel(key)
        : key;
      let hitScore = MULTIPLIER_KEYS.includes(key) ? 0 : Number(hit);
      let lastTurn = gameUpdated.turns[gameUpdated.turns.length - 1];
      let lastHit = lastTurn.hits[lastTurn.hits.length - 1] ?? null;
      let totalPlayerScore = gameUpdated.players[lastTurn.playerIndex].score;

      if (lastHit !== null && ["D", "T"].includes(lastHit.label)) {
        if (lastHit.label === hit) {
          lastTurn.hits.pop();
          hit = null;
          gameUpdated.turns[gameUpdated.turns.length - 1] = lastTurn;
        } else {
          switch (lastHit.label) {
            case "D":
              hitScore = hit * 2;
              break;
            case "T":
              hitScore = hit * 3;
              break;
          }

          lastTurn.hits[lastTurn.hits.length - 1] = {
            label: lastHit.label + hit,
            score: hitScore,
          };
        }

        totalPlayerScore =
          prevGame.players[lastTurn.playerIndex].score - hitScore;
        gameUpdated.players[lastTurn.playerIndex].score = totalPlayerScore;

        if (totalPlayerScore === 0) {
        } else if (isTotalPlayerScoreLowerThanZero(totalPlayerScore)) {
          gameUpdated = resetPlayerScore(gameUpdated, lastTurn);
          gameUpdated = switchPlayer(gameUpdated, lastTurn.playerIndex ? 0 : 1);
        }

        console.log("mult", gameUpdated);
        return gameUpdated;
      }

      if (lastTurn.hits.length >= 3) {
        const nextPlayerIndex = lastTurn.playerIndex ? 0 : 1;

        gameUpdated = switchPlayer(gameUpdated, lastTurn.playerIndex ? 0 : 1, {
          label: hit,
          score: hitScore,
        });
        totalPlayerScore = prevGame.players[nextPlayerIndex].score - hitScore;
        gameUpdated.players[nextPlayerIndex].score = totalPlayerScore;
      } else {
        if (hit !== null) {
          lastTurn.hits.push({ label: hit, score: hitScore });
        }

        totalPlayerScore =
          prevGame.players[lastTurn.playerIndex].score - hitScore;
        gameUpdated.players[lastTurn.playerIndex].score = totalPlayerScore;
      }

      if (isTotalPlayerScoreLowerThanZero(totalPlayerScore)) {
        gameUpdated = resetPlayerScore(gameUpdated, lastTurn);
        gameUpdated = switchPlayer(gameUpdated, lastTurn.playerIndex ? 0 : 1);
      }

      console.log("ok", gameUpdated);

      return gameUpdated;
    });
  }

  function isTotalPlayerScoreLowerThanZero(totalPlayerScore) {
    return totalPlayerScore < 0;
  }

  function resetPlayerScore(game, lastTurn) {
    const totalTurnScore = lastTurn.hits.reduce(
      (accumulator, currentValue) => accumulator + currentValue.score,
      0
    );
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

  console.log(game.players.find((player) => player.score === 0));
  const winner = game.players.find((player) => player.score === 0) ?? null;

  return (
    <div className="h-screen overflow-hidden flex flex-col justify-between">
      {winner !== null ? <p>{winner.name} won !</p> : <Board game={game} />}
      <Keyboard onSelectKey={handleSelectKey} />
    </div>
  );
}
