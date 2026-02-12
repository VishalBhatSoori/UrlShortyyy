'use server'

import { UrlShortnerService } from "@/services/shorteningService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import redis from "@/config/redis";

export const shortenUrl = async (formData: FormData) => {
    const originalUrl = (formData.get('originalUrl') as string)?.trim();
    console.log("Original url passed is ", originalUrl);

    if (!originalUrl) {
        redirect('/?error=empty');
    }

    const shortnerService = new UrlShortnerService();
    const shortUrl = await shortnerService.shortenUrl(originalUrl);

    await redis.del("allUrlsList");
    if (shortUrl) {
         await redis.set(`urls/${shortUrl}`, originalUrl, "EX", 604800);
    }

    revalidatePath('/urls');

    redirect('/');
}

