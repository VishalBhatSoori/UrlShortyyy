import Link from "next/link";
import ShortenForm from "./ShortenForm";
import "./urlHomePage.css";

export default function Home() {
  return (
    <>
      <div className="container">
        <div className="card">
          <h1 className="title">URL SHORTY</h1>

          <ShortenForm />
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

