"use client";

import { useFormStatus } from "react-dom";
import { shortenUrl } from "./serverAction/shortenUrlAction";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <>
            {pending && (
                <div className="toast-notification">
                    Shortening the URL...
                </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={pending}>
                {pending ? "Shortening..." : "Shorten"}
            </button>
        </>
    );
}

export default function ShortenForm() {
    return (
        <form action={shortenUrl} className="url-form">
            <input
                type="text"
                placeholder="Enter URL"
                name="originalUrl"
                className="input-field"
                required
            />
            <SubmitButton />
        </form>
    );
}
