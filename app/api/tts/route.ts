import OpenAI from 'openai';

export const runtime = "edge"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request): Promise<Response> {
    const body = await req.json();
    const { text } = body;

    const output = await openai.audio.speech.create({
        model: "tts-1-1106",
        voice: "shimmer",
        input: text,
    });

    return new Response(await output.arrayBuffer());
}
