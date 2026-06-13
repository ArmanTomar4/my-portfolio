import { Redis } from '@upstash/redis'

const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN
const redis = url && token ? new Redis({ url, token }) : null

export async function GET() {
  if (!redis) {
    return Response.json({ count: 0, offline: true })
  }
  try {
    const count = await redis.incr('visitors')
    return Response.json({ count })
  } catch {
    return Response.json({ count: 0, offline: true })
  }
}
