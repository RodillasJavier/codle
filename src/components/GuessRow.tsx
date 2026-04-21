import type { EvaluatedGuess } from "../App";

type GuessRowProps = {
  row?: string;
  evaluatedRow?: EvaluatedGuess;
}

function GuessRow({row, evaluatedRow}: GuessRowProps) {
  const letters = [];

  if (evaluatedRow) {
    evaluatedRow.forEach((letter, index) => {
      let bgClass = "bg-neutral-300";

      if (letter.status === "correct") {
        bgClass = "bg-green-400";
      } else if (letter.status === "present") {
        bgClass = "bg-yellow-300";
      } else if (letter.status === "absent") {
        bgClass = "bg-gray-300";
      }

      letters.push(
        <div 
          className={`w-15 h-15 flex items-center justify-center ${bgClass} rounded `}
          key={index}
        >
            <p className={`text-2xl font-bold`}>
              {letter.letter}
            </p>
        </div>
      );
    });
  } else {
    for (let index = 0; index < 5; index++) {
      const displayRow = row ?? "";
      const letter = displayRow[index] ?? "";

      letters.push(
        <div className="w-15 h-15 flex items-center justify-center bg-neutral-300 rounded" key={index}>
          <p className="text-2xl font-bold">
            {letter}
          </p>
        </div>
      );
    }
  }

  return(
    <div className="flex flex-row gap-2 w-full items-center justify-center space-between">
      {letters}
    </div>
  )
}

export default GuessRow;