import { Model } from 'mongoose';
import connectDB from "../config/db";
import Url, { IUrl, url } from "../models/Url";

export class UrlRepo {
    private urlModel: Model<IUrl>;
    constructor() {
        connectDB();
        this.urlModel = Url;
    }
    //create methods
    async createUrl(originalUrl: string, shortUrl: string): Promise<url | null> {
        return await this.urlModel.create({ originalUrl, shortUrl });
    }
    //read methods
    //lean() method just returns a data object and not a monoose object
    async getUrlById(id: string): Promise<url | null> {
        return await this.urlModel.findById(id).lean();
    }
    async getUrlByShortUrl(shortUrl: string): Promise<url | null> {
        return await this.urlModel.findOne({ shortUrl }).lean();
    }
    async getUrlByOriginalUrl(originalUrl: string): Promise<url | null> {
        return await this.urlModel.findOne({ originalUrl }).lean();
    }
    async getAllUrls(): Promise<url[]> {
        return await this.urlModel.find().lean();
    }
    //update method
    async updateUrl(id: string, newUrl: Partial<url>): Promise<url | null> {
        return await this.urlModel.findByIdAndUpdate(id, newUrl, { new: true }).lean();
    }
    //delete method
    async deleteUrl(id: string): Promise<url | null> {
        return await this.urlModel.findByIdAndDelete(id).lean();
    }

}