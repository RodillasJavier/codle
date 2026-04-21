import { useState } from "react"
import Guesses from "./components/Guesses"

const TARGET_WORD = 'apple';

type LetterStatus = 'correct' | 'present' | 'absent';

type EvaluatedLetter = {
  letter: string;
  status: LetterStatus;
}

export type EvaluatedGuess = EvaluatedLetter[];

function evaluateGuess(guess: string, answer: string) {
  guess = guess.toLowerCase();
  answer = answer.toLowerCase();

  const evaluatedLetters: EvaluatedLetter[] = [];

  for (let index = 0; index < guess.length; index++) {
    if (guess.charAt(index) === answer.charAt(index)) {
      evaluatedLetters.push({
        letter: guess.charAt(index),
        status: 'correct'
      });

      continue;
    }

    if (answer.includes(guess.charAt(index))) {
      evaluatedLetters.push({
        letter: guess.charAt(index),
        status: 'present'
      });

      continue;
    }

    evaluatedLetters.push({
      letter: guess.charAt(index),
      status: 'absent'
    });
  }

  return evaluatedLetters;
}

function App() {
  const [submittedGuesses, setSubmittedGuesses] = useState<EvaluatedGuess[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');

  const rows = new Array(6).fill("");

  submittedGuesses.forEach((guess, index) => {
    rows[index] = guess;
  });

  if (submittedGuesses.length < rows.length) {
    rows[submittedGuesses.length] = currentGuess;
  }

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }

    if (currentGuess.length !== 5) {
      return;
    }

    if (submittedGuesses.length >= 6) {
      return;
    }

    
    setSubmittedGuesses([...submittedGuesses, evaluateGuess(currentGuess, TARGET_WORD)]);
    setCurrentGuess("");
  }

  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center">
      <Guesses submittedGuesses={submittedGuesses} currentGuess={currentGuess}/>

      <input 
        value={currentGuess}
        onChange={(e) => setCurrentGuess(e.target.value)}
        maxLength={5}
        className="bg-neutral-300 rounded"
        onKeyDown={(e) => handleSubmit(e)}
      />
    </div>
  )
}

export default App
