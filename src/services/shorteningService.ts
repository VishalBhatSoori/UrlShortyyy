import shortId from 'shortid';
import { UrlRepo } from "../repositories/URLRepository";
import redis from "@/config/redis";

export class UrlShortnerService {
    private urlRepository;
    constructor() {
        this.urlRepository = new UrlRepo();
    }
    async shortenUrl(originalUrl: string): Promise<string> {
        let url = await this.urlRepository.getUrlByOriginalUrl(originalUrl);
        if (url) {
            return url.shortUrl;
        }
        let shortUrl = shortId();
        url = await this.urlRepository.getUrlByShortUrl(shortUrl);
        while (url) {
            shortUrl = shortId();
            url = await this.urlRepository.getUrlByShortUrl(shortUrl);
        }
        await this.urlRepository.createUrl(originalUrl, shortUrl);

        // Immediate Cache Update for Redirection
        await redis.set(`urls/${shortUrl}`, originalUrl, "EX", 604800);

        // Immediate Cache Update for "View All"
        const CACHE_KEY = "allUrlsList";

        const newUrlRecord = await this.urlRepository.getUrlByShortUrl(shortUrl);

        if (newUrlRecord) {
            const currentCache = await redis.get(CACHE_KEY);

            if (currentCache) {
                const urls = JSON.parse(currentCache);
                urls.push(newUrlRecord);
                await redis.set(CACHE_KEY, JSON.stringify(urls), "EX", 604800);
            } else {
                const allUrls = await this.urlRepository.getAllUrls();
                await redis.set(CACHE_KEY, JSON.stringify(allUrls), "EX", 604800);
            }
        }

        return shortUrl;
    }
    async getAllUrl() {
        const CACHE_KEY = "allUrlsList";

        const cachedData = await redis.get(CACHE_KEY);
        if (cachedData) {
            console.log("Service: Serving list from Redis");
            return JSON.parse(cachedData);
        }

        console.log("Service: Cache Miss! Hitting MongoDB");
        const urls = await this.urlRepository.getAllUrls();

        if (urls && urls.length > 0) {
            await redis.set(CACHE_KEY, JSON.stringify(urls), "EX", 604800);
        }

        return urls;
    }
    async getUrlByShortUrl(shortUrl: string) {
        const CACHE_KEY = `urls/${shortUrl}`;

        const cachedUrl = await redis.get(CACHE_KEY);
        if (cachedUrl) {
            console.log("Service: Redirect Hit in Redis");
            return { originalUrl: cachedUrl };
        }

        console.log("Service: Redirect Miss! Hitting MongoDB");
        const urlRecord = await this.urlRepository.getUrlByShortUrl(shortUrl);

        if (urlRecord) {
            await redis.set(CACHE_KEY, urlRecord.originalUrl, "EX", 604800);
        }
        return urlRecord;
    }
    async deleteUrl(id: string) {
        const urlRecord = await this.urlRepository.getUrlById(id);

        if (urlRecord) {
            // 1. CRITICAL: Delete from MongoDB (Source of Truth)
            const result = await this.urlRepository.deleteUrl(id);

            // 2. Delete the individual short URL cache (stops redirection)
            await redis.del(`urls/${urlRecord.shortUrl}`);

            // 3. Smart Update: Filter the cached list instead of re-fetching from DB
            const CACHE_KEY = "allUrlsList";
            const currentCache = await redis.get(CACHE_KEY);
            if (currentCache) {
                const urls = JSON.parse(currentCache);
                const updatedUrls = urls.filter((u: { _id: string }) => u._id !== id);
                await redis.set(CACHE_KEY, JSON.stringify(updatedUrls), "EX", 604800);
            }

            return result;
        }
        return null;
    }
}