export default function Keyboard({ onSelectKey }) {
  const gameKeys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "25",
    "0",
    "Double",
    "Triple",
    "Back",
  ];
  
  return (
    <div className="grid grid-cols-7 gap-1 bg-gray-600 p-2">
      {gameKeys.map((key) => {
        let cssClasses = "p-2";
        switch (key) {
          case "Double":
            cssClasses += " col-span-2 bg-orange-300 hover:bg-orange-400";
            break;
          case "Triple":
            cssClasses += " col-span-2 bg-orange-500 hover:bg-orange-600";
            break;
          case "Back":
            cssClasses += " col-span-2 bg-red-500 hover:bg-red-600";
            break;
          default:
            cssClasses += " col-span-1 bg-white hover:bg-gray-200";
            break;
        }

        return (
          <button
            key={key}
            className={cssClasses}
            onClick={() => onSelectKey(key)}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
