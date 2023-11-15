import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from 'openai';

export const runtime = "edge";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request): Promise<StreamingTextResponse> {
    const body = await req.json();
    const { image } = body;

    const output = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
            {
                role: "system",
                content: "You are a sunset poem writer. You will be given an image of a sunset and you will write a poem about it. If the sunset is not visible, you can write a poem about the image.",
            },
            {
                role: "user",
                content: [
                    {
                        type: "image_url",
                        image_url: image,
                    }
                ]
            }
        ],
        max_tokens: 700,
        stream: true,
    });

    const stream = OpenAIStream(output);
    return new StreamingTextResponse(stream);
};