import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { z } from 'zod';

const bodySchema = z.object({
  prompt: z.string().min(1),
  system: z.string().optional(),
});

function isAllowed(originHeader?: string) {
  const list = (process.env.ALLOWED_ORIGINS || '')
    .split(',').map(s => s.trim()).filter(Boolean);
  if (list.length === 0) return true;
  try {
    const u = new URL(originHeader || '');
    return list.includes(`${u.protocol}//${u.host}`);
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const originHeader = (req.headers.origin || req.headers.referer) as string | undefined;
  if (!isAllowed(originHeader)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', issues: parsed.error.issues });
  }
  const { prompt, system } = parsed.data;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });

  const client = new OpenAI({ apiKey });

  try {
    const r = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        { role: 'system', content: system ?? 'You are a precise CV writing assistant.' },
        { role: 'user', content: prompt }
      ],
    });

    const text =
      (r.output?.[0]?.content?.[0] as any)?.text ??
      (r.output_text ?? '').toString();

    return res.status(200).json({ ok: true, text });
  } catch {
    return res.status(502).json({ ok: false, error: 'Upstream AI error' });
  }
}
