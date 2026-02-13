import { NextResponse } from "next/server";
import { UrlShortnerService } from "../../../services/shorteningService";


const fetchUrls = async () => {
    const shortyServiceInstance = new UrlShortnerService();
    const response = await shortyServiceInstance.getAllUrl();
    return response;
}

export async function GET() {
    const urls = await fetchUrls();
    const response = NextResponse.json({ urls });
    return response;
}