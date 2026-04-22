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
    <div className="flex w-full max-w-[min(100%,34rem)] flex-col gap-2 px-1 sm:px-0">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div
          className="flex items-center justify-center gap-1.5 sm:gap-2"
          key={rowIndex}
        >
          {row.map((key) => {
            const isActionKey = key === 'enter' || key === 'back';
            const status = isActionKey ? undefined : keyStatuses[key];

            return (
              <button
                className={`flex flex-1 items-center justify-center rounded px-2 text-xs font-semibold uppercase transition sm:h-14 sm:text-sm ${isActionKey ? 'max-w-[4.75rem]' : ''} ${getKeyClassName(status)} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer active:scale-[0.98]'}`}
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
                {key === 'back' ?  <Delete /> : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
