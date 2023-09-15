import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from './ui/select';

interface ModelsSelectProps {
    onModelSelected: (model: string) => void;
}

interface Models {
    type: string;
    name: string;
}

const models: Models[] = [
    { type: 'gpt-3.5-turbo-16k', name: 'GPT 3.5-turbo 16k' },
    { type: 'gpt-4', name: 'GPT 4.0 8k' }
];

export function ModelSelect(props: ModelsSelectProps) {
    const [selected, setSelected] = useState<string>(models[0].type);

    function handleSelected(modelType: string) {
        const selected = models.find((model) => model.type === modelType);

        if (!selected) return;

        setSelected(selected.type);
        props.onModelSelected(selected.type);
    }
    return (
        <Select defaultValue={selected} onValueChange={handleSelected}>
            <SelectTrigger>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {models.map((model, index) => (
                    <SelectItem key={index} value={model.type}>
                        {model.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
