import { NextResponse } from "next/server";
import { cache } from 'react';
import { UrlShortnerService } from "../../../services/shorteningService";

const fetchUrls = cache(async () => {
    const shortyServiceInstance = new UrlShortnerService();
    const response = await shortyServiceInstance.getAllUrl();
    return response;
})
export async function GET() {
    const urls = await fetchUrls();
    const response = NextResponse.json({ urls });
    //remove this line later if not able to cache
    response.headers.set('Cache-control', 'public , max-age=120 s-maxage=120, stale-while-revalidate=59')
    return response;
}