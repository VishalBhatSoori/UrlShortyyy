'use server'

import { UrlShortnerService } from "@/services/shorteningService";
import { revalidatePath } from "next/cache";

export async function deleteUrlAction(formData: FormData) {
    const id = formData.get('id') as string;
    
    if (!id) return;

    const shortnerService = new UrlShortnerService();
    await shortnerService.deleteUrl(id);

    // This tells Next.js to refresh the list automatically!
    revalidatePath('/urls');
}