import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  retry: {
    retries: 3,
    backoff: (retryCount) => Math.exp(retryCount) * 50, // Exponential backoff
  },
  responseEncoding: false, // Faster binary response
  automaticDeserialization: false, // Manual JSON parsing for better performance
})

export const CACHE_TTL = 60 * 60 * 24 * 30 // 30 days in seconds