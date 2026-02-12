import { UrlShortnerService } from "@/services/shorteningService";
import { redirect } from "next/navigation";
import redis from "@/config/redis";

async function fetchOriginalUrl(url: string) {

    const cachedUrl = await redis.get(url);
    if (cachedUrl) {
        console.log("Hot Path Hit: Redirecting via Redis");
        return cachedUrl;
    }
    console.log("Hot Path Miss: Falling back to MongoDB");
    const urlService = new UrlShortnerService();
    const response = await urlService.getUrlByShortUrl(url);
    if(response?.originalUrl){
        await redis.set(url, response.originalUrl, "EX", 604800);
        return response.originalUrl;
    }
    return null;
}

export default async function urlRedirect({params}: {params: {id: string}}) {
    const { id } = await params
    const original = await fetchOriginalUrl(`urls/${id}`);
    console.log(original);
    if(original)
        redirect(original);
    redirect('/404');
    return null;
}