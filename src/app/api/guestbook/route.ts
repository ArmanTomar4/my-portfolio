import { Redis } from '@upstash/redis'
import { GuestbookMessage } from '@/types'

const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN
const redis = url && token ? new Redis({ url, token }) : null

export async function GET() {
  if (!redis) {
    return Response.json({ messages: [], offline: true })
  }
  try {
    const messages = await redis.lrange<GuestbookMessage>('guestbook', 0, 19)
    return Response.json({ messages })
  } catch {
    return Response.json({ messages: [], offline: true })
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, message } = body

  if (!name || !message) {
    return Response.json({ error: 'Name and message required' }, { status: 400 })
  }

  if (!redis) {
    return Response.json({ error: 'Guestbook is offline' }, { status: 503 })
  }

  const entry: GuestbookMessage = {
    name: String(name).slice(0, 50),
    message: String(message).slice(0, 200),
    timestamp: new Date().toISOString(),
  }

  try {
    await redis.lpush('guestbook', entry)
    return Response.json({ success: true })
  } catch {
    return Response.json({ error: 'Guestbook is offline' }, { status: 503 })
  }
}
