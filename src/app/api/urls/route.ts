import { NextResponse } from "next/server";
import { UrlShortnerService } from "../../../services/shorteningService";
import redis from "@/config/redis";

const fetchUrls = async () => {
    const CACHE_KEY = "allUrlsList";

    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
        console.log("Dashboard: Serving from Redis");
        return JSON.parse(cachedData);
    }

    console.log("Dashboard: Cache Miss, hitting MongoDB");
    const shortyServiceInstance = new UrlShortnerService();
    const response = await shortyServiceInstance.getAllUrl();

    await redis.set(CACHE_KEY, JSON.stringify(response), "EX", 604800);

    return response;
}

export async function GET() {
    const urls = await fetchUrls();
    const response = NextResponse.json({ urls });
    return response;
}