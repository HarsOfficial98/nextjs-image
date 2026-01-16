'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sparkles, Download, ImageIcon } from 'lucide-react';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const text = await res.text();
      if (!text) throw new Error('Empty response from server');

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Invalid JSON response: ' + text);
      }

      if (!res.ok) throw new Error(data.error || 'API error');

      setImageUrl(data.imageUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Sparkles className="text-blue-600" />
            AI Image Generator
          </CardTitle>
          <CardDescription>Generate images from text</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your image..."
            rows={6}
          />

          <Button onClick={generateImage} disabled={loading || !prompt.trim()}>
            {loading ? <Loader2 className="animate-spin" /> : 'Generate'}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {imageUrl && (
            <div className="mt-4">
              <img
                src={imageUrl}
                alt="Generated"
                className="rounded-md border object-cover w-full"
              />
              <Button
                className="mt-2"
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = imageUrl;
                  a.download = `generated-${Date.now()}.png`;
                  a.click();
                }}
              >
                <Download className="mr-2" /> Download
              </Button>
            </div>
          )}

          {!imageUrl && !loading && (
            <div className="text-center text-gray-400 mt-4">
              <ImageIcon className="mx-auto" />
              Image will appear here
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
