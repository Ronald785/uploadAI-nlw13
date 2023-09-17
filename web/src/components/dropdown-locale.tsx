import { useEffect, useState } from "react";
import i18n from "../lib/i18n";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Locales = "pt-BR" | "pt" | "en" | "es";

const validLocales = new Set<Locales>(["pt-BR", "pt", "en", "es"]);
const defaultLocale: Locales = "pt-BR";

export function DropdownLocale() {
    const [locale, setLocale] = useState<Locales>(localStorage.locale || defaultLocale);

    function handleChangeDropdownValue(dropValue: string) {
        if (validLocales.has(dropValue as Locales)) {
            setLocale(dropValue as Locales);
            localStorage.locale = dropValue;
        }
    }

    useEffect(() => {
        i18n.changeLanguage(locale);
    }, [locale]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">{locale.toUpperCase()}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuRadioGroup
                    value={locale}
                    onValueChange={handleChangeDropdownValue}
                >
                    <DropdownMenuRadioItem value="pt-BR">PT-BR</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="en">EN</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="es">ES</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
