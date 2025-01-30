import { InvalidateCache } from '@data/protocols/cache/invalidate-cache';
import { RecoverCache } from '@data/protocols/cache/recover-cache';
import { SaveCache } from '@data/protocols/cache/save-cache';
import { Redis as RedisClient } from 'ioredis';
import redis from './config';

class RedisCache implements InvalidateCache, RecoverCache, SaveCache {
  private static instance: RedisCache;
  private client!: RedisClient;

  constructor() {
    this.client = redis;
  }

  public static getInstance(): RedisCache {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache();
    }
    return RedisCache.instance;
  }

  public async save<T>(key: string, value: T, ttl?: number): Promise<void> {
    const serializedValue = JSON.stringify(value);

    if (ttl) {
      await this.client.setex(key, ttl, serializedValue);
    } else {
      await this.client.set(key, serializedValue);
    }
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }
}

export const cacheAdapter = RedisCache.getInstance();
