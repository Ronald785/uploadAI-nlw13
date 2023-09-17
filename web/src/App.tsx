import { Github, Wand2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { Textarea } from './components/ui/textarea';
import { Label } from './components/ui/label';
import { Slider } from './components/ui/slider';
import { VideoInputForm } from './components/video-input-form';
import { PromptSelect } from './components/prompt-select';
import { ToggleThemeMode } from './components/toggle-theme-mode';
import { useState } from 'react';
import { useCompletion } from 'ai/react';
import { ModelSelect } from './components/model-select';
import { useTranslation } from 'react-i18next';
import { DropdownLocale } from './components/dropdown-locale';

export function App() {
    const [temperature, setTemperature] = useState(0.5);
    const [videoId, setVideoId] = useState<string | null>(null);
    const [model, setModel] = useState<string>('gpt-3.5-turbo-16k');

    const {
        input,
        setInput,
        handleInputChange,
        handleSubmit,
        completion,
        isLoading
    } = useCompletion({
        api: 'http://localhost:3333/ai/complete',
        body: {
            videoId,
            temperature,
            model
        },
        headers: {
            'Content-type': 'application/json'
        }
    });
    const { t } = useTranslation();
    return (
        <div className="min-h-screen flex flex-col">
            <header className="px-6 py-3 flex items-center justify-between border-b">
                <h1 className="text-xl font-bold">UploadAI</h1>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                        {t('developed_at')}🚀
                    </span>
                    <Separator orientation="vertical" className="h-6" />
                    <Button variant="outline">
                        <a
                            href="https://github.com/Ronald785/uploadAI-nlw13"
                            target="_blank"
                            className="flex items-center"
                        >
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                        </a>
                    </Button>

                    <DropdownLocale />

                    <ToggleThemeMode />
                </div>
            </header>

            <main className="flex-1 p-6 flex gap-6">
                <div className="flex flex-col flex-1 gap-4">
                    <div className="grid grid-rows-2 gap-4 flex-1">
                        <Textarea
                            className="resize-none p-4 leading-relaxed"
                            placeholder={t('include_prompt')}
                            value={input}
                            onChange={handleInputChange}
                        />
                        <Textarea
                            className="resize-none p-4 leading-relaxed"
                            placeholder={t('ai_result')}
                            value={completion}
                            readOnly
                        />
                    </div>

                    <p className="text-sm text-muted-foreground">
                        {t('reminder1')}
                        <code className="text-violet-400">{` {transcription} `}</code>
                        {t('reminder2')}
                    </p>
                </div>

                <aside className="w-80 space-y-6">
                    <VideoInputForm onVideoUploaded={setVideoId} />

                    <Separator />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>{t('prompt')}</Label>
                            <PromptSelect onPromptSelected={setInput} />
                        </div>

                        <div className="space-y-2">
                            <Label>{t('model')}</Label> - {model}
                            <ModelSelect onModelSelected={setModel} />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label>{t('temperature')}</Label>
                                <span>{temperature}</span>
                            </div>
                            <Slider
                                min={0}
                                max={1}
                                step={0.1}
                                value={[temperature]}
                                onValueChange={(value) =>
                                    setTemperature(value[0])
                                }
                            />
                            <span className="block text-sm text-muted-foreground italic leading-relaxed">
                                {t('higher_values')}
                            </span>
                        </div>

                        <Separator />

                        <Button
                            disabled={isLoading}
                            type="submit"
                            className="w-full"
                        >
                            {t('execute')}
                            <Wand2 className="w-4 h-4 ml-2" />
                        </Button>
                    </form>
                </aside>
            </main>
        </div>
    );
}
