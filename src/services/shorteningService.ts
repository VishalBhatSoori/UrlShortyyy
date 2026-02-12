import shortId from 'shortid';
import { UrlRepo } from "../repositories/URLRepository";

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
        await this.urlRepository.createUrl(originalUrl, `urls/${shortUrl}`);
        return shortUrl;
    }
    async getAllUrl() {
        return this.urlRepository.getAllUrls();
    }
    async getUrlByShortUrl(shortUrl: string) {
        return await this.urlRepository.getUrlByShortUrl(shortUrl);
    }
    async deleteUrl(id: string) {
        return await this.urlRepository.deleteUrl(id);
    }
}