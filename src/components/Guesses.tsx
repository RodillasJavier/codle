import GuessRow from "./GuessRow";

function Guesses() {
  return (
    <div className="flex flex-col h-100 w-3xl items-center justify-between">
      <GuessRow></GuessRow>
      <GuessRow></GuessRow>
      <GuessRow></GuessRow>
      <GuessRow></GuessRow>
      <GuessRow></GuessRow>
    </div>
  )
}

export default Guesses;