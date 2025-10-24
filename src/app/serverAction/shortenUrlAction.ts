'use server'

import { UrlShortnerService } from "@/services/shorteningService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const shortenUrl = async (formData: FormData) => {
    const originalUrl = (formData.get('originalUrl') as string)?.trim();
    console.log("Original url passed is ", originalUrl);

    if (!originalUrl) {
        redirect('/?error=empty');
    }

    const shortnerService = new UrlShortnerService();
    const shortUrl = await shortnerService.shortenUrl(originalUrl);

    revalidatePath('/urls');

    redirect('/');
}

