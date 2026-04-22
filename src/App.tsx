import { useCallback, useEffect, useState } from "react"
import Guesses from "./components/Guesses"
import Keyboard from "./components/Keyboard"

const ANSWER_WORDS = [
  "array",
  "bytes",
  "cache",
  "class",
  "cloud",
  "codec",
  "debug",
  "fetch",
  "index",
  "input",
  "linux",
  "logic",
  "macro",
  "merge",
  "parse",
  "pixel",
  "proxy",
  "queue",
  "react",
  "scope",
  "stack",
  "token",
] as const;

type LetterStatus = 'correct' | 'present' | 'absent';

type EvaluatedLetter = {
  letter: string;
  status: LetterStatus;
}

export type EvaluatedGuess = EvaluatedLetter[];

function getRandomAnswer(previousAnswer?: string) {
  let nextAnswer = ANSWER_WORDS[Math.floor(Math.random() * ANSWER_WORDS.length)];

  while (nextAnswer === previousAnswer) {
    nextAnswer = ANSWER_WORDS[Math.floor(Math.random() * ANSWER_WORDS.length)];
  }

  return nextAnswer;
}

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
  const [answer, setAnswer] = useState(() => getRandomAnswer());
  const [submittedGuesses, setSubmittedGuesses] = useState<EvaluatedGuess[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const handleLetter = useCallback((letter: string) => {
    if (gameStatus !== 'playing' || !/^[a-zA-Z]$/.test(letter)) {
      return;
    }

    setCurrentGuess((prev) => {
      if (prev.length >= 5) {
        return prev;
      }

      return prev + letter.toLowerCase();
    });
  }, [gameStatus]);

  const handleDelete = useCallback(() => {
    if (gameStatus !== 'playing') {
      return;
    }

    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [gameStatus]);

  const handleSubmit = useCallback(() => {
    if (currentGuess.length !== 5) {
      return;
    }

    if (submittedGuesses.length >= 6 || gameStatus !== 'playing') {
      return;
    }

    const normalizedGuess = currentGuess.toLowerCase();
    const nextSubmittedGuesses = [...submittedGuesses, evaluateGuess(normalizedGuess, answer)];

    setSubmittedGuesses(nextSubmittedGuesses);
    setCurrentGuess("");

    if (normalizedGuess === answer) {
      setGameStatus('won');
      return;
    }

    if (nextSubmittedGuesses.length >= 6) {
      setGameStatus('lost');
    }
  }, [answer, currentGuess, gameStatus, submittedGuesses]);

  const startNewGame = useCallback(() => {
    setAnswer((previousAnswer) => getRandomAnswer(previousAnswer));
    setSubmittedGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
  }, []);

  useEffect(() => {
    function handleKeyDown (e: KeyboardEvent) {
      if (gameStatus !== 'playing') {
        return;
      }

      if (e.key === "Enter") {
        handleSubmit();
        return;
      }

      if (e.key === "Backspace") {
        handleDelete();
        return;
      }

      if (/^[a-zA-Z]$/.test(e.key)) {
        handleLetter(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStatus, handleDelete, handleLetter, handleSubmit]);

  const isGameOver = gameStatus !== 'playing';
  const statusMessage = gameStatus === 'won'
    ? 'Correct. Start a new round for another CS word.'
    : gameStatus === 'lost'
      ? `Out of guesses. The word was ${answer.toUpperCase()}.`
      : 'Guess the five-letter computer science word.';
  const footerLinks = [
    {
      href: 'https://buymeacoffee.com/rodillasjavier',
      label: 'Buy Me a Coffee',
    },
    {
      href: 'http://x.com/rodillasjavier',
      label: 'X',
    },
    {
      href: 'https://www.linkedin.com/in/rodillasjavier/',
      label: 'LinkedIn',
    },
    {
      href: 'https://github.com/RodillasJavier',
      label: 'GitHub',
    },
  ] as const;

/**
 * Get the status of each key on the keyboard based on the submitted guesses.
 * Each letter keeps its best status across all guesses: correct > present > absent.
 */
const keyStatuses: Record<string, LetterStatus> = {};

for (const guess of submittedGuesses) {
  for (const { letter, status } of guess) {
    const current = keyStatuses[letter];

    const isStatusCorrect = status === 'correct';
    const isStatusPresent = status === 'present';
    const isCurrentStatusAbsent = current === 'absent';

    if (!current || isStatusCorrect || (isStatusPresent && isCurrentStatusAbsent)) {
      keyStatuses[letter] = status;
    }
  }
}

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-3xl flex-col items-center gap-10">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-black uppercase tracking-[0.3em]">
            Codle(?)
          </h1>

          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-600">
            (open to name suggestions)
          </p>
          <p className="text-sm text-neutral-700">{statusMessage}</p>
        </div>

        {/* Game Board */}
        <Guesses submittedGuesses={submittedGuesses} currentGuess={currentGuess}/>

        <Keyboard
          disabled={isGameOver}
          keyStatuses={keyStatuses}
          onDelete={handleDelete}
          onEnter={handleSubmit}
          onKeyPress={handleLetter}
        />

        {/* Action Button */}
        {isGameOver ? (
          <button
            className="cursor-pointer rounded bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-neutral-800"
            onClick={startNewGame}
            type="button"
          >
            New Game
          </button>
        ) : null}

        <footer className="flex w-full flex-col items-center gap-3 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            Support and follow
          </p>

          <div className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-700 sm:gap-x-12">
            {footerLinks.map(({ href, label }) => (
              <a
                className="transition hover:text-black hover:underline"
                href={href}
                key={href}
                rel="noreferrer"
                target="_blank"
              >
                {label}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
