import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export function ToggleThemeMode() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        console.log(localStorage);
        if (
            localStorage.theme === 'dark' ||
            (!('theme' in localStorage) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDarkMode(false);
        }
    }, []);

    function toggleTheme() {
        if (
            localStorage.theme === 'dark' ||
            (!('theme' in localStorage) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            document.documentElement.classList.remove('dark');
            setIsDarkMode(false);
            localStorage.theme = 'light';
        } else {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
            localStorage.theme = 'dark';
        }
    }
    return (
        <Button
            title="Tema"
            variant="secondary"
            className="flex w-10 p-0"
            onClick={toggleTheme}
        >
            {isDarkMode ? (
                <Sun className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
        </Button>
    );
}
