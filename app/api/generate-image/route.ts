import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.tokenfactory.nebius.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY, // make sure .env.local has this
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim() === '') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Nebius image generation
    const response = await client.images.generate({
      model: 'black-forest-labs/flux-dev', // replace with your model
      prompt,
      size: '1024x1024',
    });

    const imageUrl = response?.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL returned from API' }, { status: 500 });
    }

    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    console.error('Image generation error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
