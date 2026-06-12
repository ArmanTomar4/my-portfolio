import { Redis } from '@upstash/redis'
import { GuestbookMessage } from '@/types'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function GET() {
  const messages = await redis.lrange<GuestbookMessage>('guestbook', 0, 19)
  return Response.json({ messages })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, message } = body

  if (!name || !message) {
    return Response.json({ error: 'Name and message required' }, { status: 400 })
  }

  const entry: GuestbookMessage = {
    name: String(name).slice(0, 50),
    message: String(message).slice(0, 200),
    timestamp: new Date().toISOString(),
  }

  await redis.lpush('guestbook', entry)
  return Response.json({ success: true })
}
