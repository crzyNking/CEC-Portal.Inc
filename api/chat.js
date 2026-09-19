const rateBuckets = new Map()
const RATE_LIMIT = 20
const RATE_WINDOW_MS = 60 * 1000

function isRateLimited(ip) {
  const now = Date.now()
  const bucket = rateBuckets.get(ip) || { count: 0, resetAt: now + RATE_WINDOW_MS }
  if (now > bucket.resetAt) {
    bucket.count = 0
    bucket.resetAt = now + RATE_WINDOW_MS
  }
  bucket.count += 1
  rateBuckets.set(ip, bucket)
  if (rateBuckets.size > 1000) {
    for (const [key, b] of rateBuckets) {
      if (now > b.resetAt) rateBuckets.delete(key)
    }
  }
  return bucket.count > RATE_LIMIT
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  }

  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired session' })
    }
  } catch {
    return res.status(500).json({ error: 'Auth verification failed' })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API not configured' })
  }

  try {
    const { messages, model } = req.body

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      return res.status(400).json({ error: 'Invalid messages payload' })
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': req.headers.origin || 'https://cec-portal.inc',
        'X-Title': 'KnowsMore AI',
      },
      body: JSON.stringify({
        model: model || 'z-ai/glm-5.2:free',
        messages,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to communicate with AI service' })
  }
}
