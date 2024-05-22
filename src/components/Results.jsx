export default function Results({ players }) {
  function compare( a, b ) {
    if ( a.score < b.score ){
      return -1;
    }
    if ( a.score > b.score ){
      return 1;
    }
    return 0;
  }
  
  players.sort( compare );

  return (
    <div className="flex flex-col gap-4 p-2 overflow-auto">
      <h1 className="text-3xl">Résultats</h1>
      <ul className="border-2 border-black">
        {players.map((player, index) => {
          let cssClasses = "p-2";
          if (players.length !== index + 1) {
            cssClasses += " border-b-2 border-b-gray-400";
          }
          return (
            <li key={player.name} className={cssClasses}>
              <p>
                {index + 1}. {player.name} | Score : {player.score}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
