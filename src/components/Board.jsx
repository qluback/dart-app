export default function Board({ game }) {
  let currentGame = game;
  const activeTurn = currentGame.turns[currentGame.turns.length - 1];
  return (
    <div className="flex flex-col gap-4 p-2 overflow-auto">
      {currentGame.players.map((player, index) => {
        const lastPlayerTurn =
          currentGame.turns.findLast((turn) => turn.playerIndex === index) ??
          null;

        let hitsItems = [];
        for (let i = 0; i < 3; i++) {
          let hit = {label: null, score: null};
          if (lastPlayerTurn !== null) {
            hit = lastPlayerTurn.hits[i] ?? hit;
          }
          hitsItems.push(
            <li
              key={player.name + i}
              className="flex justify-center items-center bg-gray-500 text-white h-8 w-8"
            >
              <span>{hit.label}</span>
            </li>
          );
        }
        
        let totalTurnScore = 0;
        if (lastPlayerTurn !== null) {
          totalTurnScore = lastPlayerTurn.hits.reduce(
            (accumulator, currentValue) => accumulator + currentValue.score,
            0,
          );
        }

        let cssClassesContainer = "border-2 border-black flex justify-between items-center p-2";
        if (activeTurn.playerIndex === index) {
          cssClassesContainer += " bg-green-500";
        }

        return (
          <div key={player.name} className={cssClassesContainer}>
            <div className="flex flex-col items-center w-20">
              <span className="text-3xl font-bold">{player.score}</span>
              <span>{player.name}</span>
            </div>
            <div className="flex flex-col justify-center">
              <ul className="flex gap-2">{hitsItems}</ul>
              <span className="text-center font-bold mt-2">{totalTurnScore}</span>
            </div>
            <div className="flex flex-col text-right">
              <span>Sets : 0</span>
              <span>Legs : 0</span>
              <span>ø : 15,00</span>
            </div>
          </div>
        );
      })}
      <ul>
        {currentGame.turns.map((turn) => {
          // console.log(turn);
          return turn.hits.map((hit, index) => {
            // console.log(hit)
            return (
              <li key={index}>
                {turn.playerIndex} hits {hit.label}
              </li>
            );
          });
        })}
      </ul>
    </div>
  );
}
