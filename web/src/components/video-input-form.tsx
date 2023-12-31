import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { FileVideo, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react';
import { getFFmpeg } from '@/lib/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { api } from '@/lib/axios';
import { useTranslation } from 'react-i18next';

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success';

interface VideoInputFormProps {
    onVideoUploaded: (id: string) => void;
}

export function VideoInputForm(props: VideoInputFormProps) {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [status, setStatus] = useState<Status>('waiting');

    const promptInputRef = useRef<HTMLTextAreaElement>(null);

    const { t } = useTranslation();

    const statusMessages = {
        converting: t('converting'),
        uploading: t('loading'),
        generating: t('transcribing'),
        success: t('success')
    };

    function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.currentTarget;

        if (!files) return;

        const selectedFile = files[0];

        setVideoFile(selectedFile);
    }

    async function converteVideoToAudio(video: File) {
        console.log('Convert started');

        const ffmpeg = await getFFmpeg();

        await ffmpeg.writeFile('input.mp4', await fetchFile(video));

        // ffmpeg.on('log', (log) => {
        //     console.log('FFmpeg log: ', log);
        // });

        ffmpeg.on('progress', (progress) => {
            console.log(
                'Convert progress: ' + Math.round(progress.progress * 100)
            );
        });

        await ffmpeg.exec([
            '-i',
            'input.mp4',
            '-map',
            '0:a',
            '-b:a',
            '20k',
            '-acodec',
            'libmp3lame',
            'audio.mp3'
        ]);

        const data = await ffmpeg.readFile('audio.mp3');

        const audioFileBlob = new Blob([data], { type: 'audio/mpeg' });
        const audioFile = new File([audioFileBlob], 'audio.mp3', {
            type: 'audio/mpeg'
        });

        console.log('Convert finished');

        return audioFile;
    }

    async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const prompt = promptInputRef.current?.value;

        if (!videoFile) return;

        setStatus('converting');

        const audioFile = await converteVideoToAudio(videoFile);

        const data = new FormData();

        data.append('file', audioFile);

        setStatus('uploading');

        const response = await api.post('/videos', data);

        const videoId = response.data.video.id;

        setStatus('generating');

        await api.post(`/videos/${videoId}/transcription`, { prompt });

        setStatus('success');

        props.onVideoUploaded(videoId);
    }

    const previewURL = useMemo(() => {
        if (!videoFile) return null;

        return URL.createObjectURL(videoFile);
    }, [videoFile]);

    return (
        <form onSubmit={handleUploadVideo} className="space-y-6">
            <label
                data-disabled={status !== 'waiting' && status != 'success'}
                htmlFor="video"
                className="data-[disabled=true]:cursor-not-allowed relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
            >
                {previewURL ? (
                    <video
                        src={previewURL}
                        controls={false}
                        className="pointer-events-none absolute inset-0"
                    />
                ) : (
                    <>
                        <FileVideo className="h-4 w-4" />
                        {t('select_video')}
                    </>
                )}
            </label>
            <input
                disabled={status != 'waiting' && status != 'success'}
                type="file"
                id="video"
                accept="video/mp4"
                className="sr-only"
                onChange={handleFileSelected}
            />

            <Separator />

            <div className="space-y-2">
                <Label htmlFor="transcription_prompt">
                    {t('transcription_prompt')}
                </Label>
                <Textarea
                    ref={promptInputRef}
                    disabled={status != 'waiting' && status != 'success'}
                    id="transcription_prompt"
                    className="h-20 leading-relaxed resize-none"
                    placeholder={t('keywords_sentence')}
                />
            </div>

            <Button
                data-success={status == 'success'}
                disabled={status != 'waiting' && status != 'success'}
                type="submit"
                className="w-full data-[success=true]:bg-emerald-400"
            >
                {status == 'waiting' ? (
                    <>
                        {t('upload_video')}
                        <Upload className="w-4 h-4 ml-2" />
                    </>
                ) : (
                    statusMessages[status]
                )}
            </Button>
        </form>
    );
}
