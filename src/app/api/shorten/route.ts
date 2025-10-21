import { NextResponse } from "next/server";
import { UrlShortnerService } from "../../../services/shorteningService";

export async function POST(req: Request) {
    const { originalURL } = await req.json();
    const shortyServiceInstance = new UrlShortnerService();
    const shortUrl = await shortyServiceInstance.shortenUrl(originalURL);
    return NextResponse.json({ shortUrl }, { status: 201 });
}
export async function GET() {
    const shortyServiceInstance = new UrlShortnerService();
    const response = await shortyServiceInstance.getAllUrl();
    return NextResponse.json({ response });
}