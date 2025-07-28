export default function Board({ game }) {
  let currentGame = game;
  const activeTurn = currentGame.turns[currentGame.turns.length - 1];
  return (
    <div className="flex flex-col gap-4 p-2 overflow-auto w-full xl:flex-1">
      {currentGame.players.map((player, currentPlayerIndex) => {
        const lastPlayerTurn =
          currentGame.turns.findLast(
            (turn) => turn.playerIndex === currentPlayerIndex
          ) ?? null;

        let hitsItems = [];
        for (let i = 0; i < 3; i++) {
          let hit = { label: null, score: null };
          if (lastPlayerTurn !== null) {
            hit = lastPlayerTurn.hits[i] ?? hit;
          }

          const isHitCompleted = hit.label !== null && hit.label !== "D" && hit.label !== "T";

          let bgClass = "border-neutral-500";
          if (isHitCompleted && hit.label.includes("D")) {
            bgClass = "border-orange-300";
          } else if (isHitCompleted && hit.label.includes("T")) {
            bgClass = "border-orange-500";
          }

          hitsItems.push(
            <li
              key={player.name + i}
              className={`flex justify-center items-center h-10 w-10 border-2 ${bgClass} rounded-full xl:text-xl xl:h-16 xl:w-16`}
            >
              {isHitCompleted && <span>{hit.label}</span>}
            </li>
          );
        }

        let totalTurnScore = 0;
        if (lastPlayerTurn !== null) {
          totalTurnScore = lastPlayerTurn.hits.reduce(
            (accumulator, currentValue) => accumulator + currentValue.score,
            0
          );
        }

        let playerTurnsScore = [];
        currentGame.turns.map((turn) => {
          if (turn.playerIndex === currentPlayerIndex) {
            const turnScore = turn.hits.filter(hit => !["D", "T"].includes(hit.label)).reduce(
              (accumulator, currentValue) => accumulator + currentValue.score,
              0
            );

            playerTurnsScore.push(turnScore);
          }
        });

        let averageTurns =
          playerTurnsScore.length > 0
            ? playerTurnsScore.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              ) / playerTurnsScore.length
            : 0;

        return (
          <div
            key={player.name}
            className="relative flex justify-between items-center p-6 pl-6 bg-white rounded-2xl w-full"
          >
            {activeTurn.playerIndex === currentPlayerIndex && (
              <div className="h-full w-4 bg-green-500 absolute left-0 rounded-l-2xl"></div>
            )}
            <div className="flex flex-col items-center w-20">
              <span className="text-3xl font-bold">{player.score}</span>
              <span>{player.name}</span>
            </div>
            <div className="flex flex-col justify-center">
              <ul className="flex gap-2">{hitsItems}</ul>
              <span className="text-center font-bold mt-2">
                {totalTurnScore}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span>Sets : 0</span>
              <span>Legs : 0</span>
              <span>ø : {averageTurns.toFixed(2)}</span>
            </div>
          </div>
        );
      })}
      {/* <ul>
        {currentGame.turns.map((turn) => {
          return turn.hits.map((hit, hitIndex) => {
            return (
              <li key={hitIndex}>
                {turn.playerIndex} hits {hit.label}
              </li>
            );
          });
        })}
      </ul> */}
    </div>
  );
}
