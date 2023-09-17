import { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from './ui/select';
import { api } from '@/lib/axios';
import { useTranslation } from 'react-i18next';

interface Prompt {
    id: string;
    title: string;
    template: string;
}

interface PromptSelectProps {
    onPromptSelected: (template: string) => void;
}

export function PromptSelect(props: PromptSelectProps) {
    const [prompts, setPrompts] = useState<Prompt[] | null>(null);

    useEffect(() => {
        api.get('/prompts').then((response) => {
            setPrompts(response.data);
            console.log(response.data);
        });
    }, []);

    function handlePromptSelected(promptId: string) {
        const selectedPrompt = prompts?.find((prompt) => prompt.id == promptId);

        if (!selectedPrompt) return;

        props.onPromptSelected(selectedPrompt.template);
    }

    const { t } = useTranslation();
    return (
        <Select onValueChange={handlePromptSelected}>
            <SelectTrigger>
                <SelectValue placeholder={t('select_prompt')} />
            </SelectTrigger>
            <SelectContent>
                {prompts?.map((prompt) => {
                    return (
                        <SelectItem key={prompt.id} value={prompt.id}>
                            {prompt.title}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}
