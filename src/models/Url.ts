import mongoose, { Document, Model } from 'mongoose';

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
        unique: true
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

export interface url {
    originalUrl: string,
    shortUrl: string
}

export interface IUrl extends url, Document { };
const Url: Model<IUrl> = mongoose.models.Url || mongoose.model<IUrl>('Url', urlSchema);

export default Url;
