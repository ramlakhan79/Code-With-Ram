import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Dropdown from './ui/Dropdown';

const OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Current = OPTIONS.find((o) => o.value === theme)?.icon || Monitor;
  return (
    <Dropdown label="Change theme" trigger={<Current className="h-5 w-5" aria-hidden />} panelClassName="w-40 p-1">
      {(close) => (
        <ul role="listbox" aria-label="Theme">
          {OPTIONS.map(({ value, label, icon: Icon }) => (
            <li key={value}>
              <button
                role="option"
                aria-selected={theme === value}
                onClick={() => { setTheme(value); close(); }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-raised ${theme === value ? 'font-semibold' : ''}`}
              >
                <Icon className="h-4 w-4" aria-hidden /> {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Dropdown>
  );
}
