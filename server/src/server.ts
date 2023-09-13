import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideosRoute } from "./routes/upload-video";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { generateAICompletionRoute } from "./routes/generate-ai-completion";

const app = fastify();

app.register(fastifyCors, {
    origin: "*",
});

//Routes
app.register(getAllPromptsRoute);
app.register(uploadVideosRoute);
app.register(createTranscriptionRoute);
app.register(generateAICompletionRoute);

app.listen({ port: 3333 }, () => {
    console.log("Server running: http://localhost:3333/");
});
