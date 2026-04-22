import { Delete } from 'lucide-react';

type LetterStatus = 'correct' | 'present' | 'absent';

type KeyboardProps = {
  disabled: boolean;
  keyStatuses: Record<string, LetterStatus>;
  onDelete: () => void;
  onEnter: () => void;
  onKeyPress: (letter: string) => void;
}

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'back'],
] as const;

function getKeyClassName(status?: LetterStatus) {
  if (status === 'correct') {
    return 'bg-green-400 text-black';
  }

  if (status === 'present') {
    return 'bg-yellow-300 text-black';
  }

  if (status === 'absent') {
    return 'bg-gray-400 text-black';
  }

  return 'bg-neutral-200 text-black';
}

function Keyboard({ disabled, keyStatuses, onDelete, onEnter, onKeyPress }: KeyboardProps) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2 sm:max-w-xl">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div
          className="flex w-full items-center justify-center gap-1 sm:gap-2"
          key={rowIndex}
        >
          {row.map((key) => {
            const isActionKey = key === 'enter' || key === 'back';
            const status = isActionKey ? undefined : keyStatuses[key];

            return (
              <button
                className={`flex min-w-0 items-center justify-center rounded text-xs font-semibold uppercase transition sm:h-14 sm:text-sm ${isActionKey ? 'h-10 shrink-0 px-3 sm:px-4' : 'h-10 flex-1 px-1'} ${getKeyClassName(status)} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer active:scale-[0.98]'}`}
                disabled={disabled}
                key={key}
                onClick={() => {
                  if (key === 'enter') {
                    onEnter();
                    return;
                  }

                  if (key === 'back') {
                    onDelete();
                    return;
                  }

                  onKeyPress(key);
                }}
                type="button"
              >
                {key === 'back' ? <Delete className="h-4 w-4 sm:h-5 sm:w-5" /> : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
