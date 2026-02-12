import Link from "next/link";
import { shortenUrl } from "./serverAction/shortenUrlAction";
import "./urlHomePage.css";

export default function Home() {
  return (
    <>
      <div className="container">
        <div className="card">
          <h1 className="title">URL SHORTY</h1>

          <form action={shortenUrl} className="url-form">
            <input
              type="text"
              placeholder="Enter URL"
              name="originalUrl"
              className="input-field"
            />

            <button type="submit" className="btn btn-primary">
              Shorten
            </button>
          </form>
        </div>

        <div className="links-container">
          <Link href="/urls" className="btn btn-secondary">
            View All Shortened URLS
          </Link>
        </div>
      </div>
    </>
  );
}

