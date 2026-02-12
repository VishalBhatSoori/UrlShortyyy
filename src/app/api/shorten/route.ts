import { NextResponse } from "next/server";
import { UrlShortnerService } from "../../../services/shorteningService";
import redis from "@/config/redis";

export async function POST(req: Request) {
    const { originalURL } = await req.json();

    const shortyServiceInstance = new UrlShortnerService();
    const shortId = await shortyServiceInstance.shortenUrl(originalURL);
    const shortUrl=`urls/${shortId}`;

    await redis.set(shortUrl, originalURL, "EX", 604800);
    await redis.del("allUrlsList");

    return NextResponse.json({ shortUrl }, { status: 201 });
}
