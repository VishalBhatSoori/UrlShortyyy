import { UrlShortnerService } from "@/services/shorteningService";
import { redirect } from "next/navigation";

async function fetchOriginalUrl(url: string) {
    const urlService = new UrlShortnerService();
    const response = await urlService.getUrlByShortUrl(url);
    return response?.originalUrl;
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