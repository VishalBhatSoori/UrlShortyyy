import Link from 'next/link';
import './urllist.css';

async function fetchUrls() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/urls`, {
    cache: 'force-cache',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch urls');
  }
  return response.json();
}

export default async function UrlList() {
  let urls;
  try {
    urls = await fetchUrls();
    console.log(urls);
  } catch (error) {
    console.log(error);
    return (
      <div className="error-container">
        <div className="content-box">
          <h1 className="title">Error</h1>
          <p className="error-message">Failed to Load URLs</p>
          <Link href="/" className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>
            Go to Home Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="content-box">
        <h1 className="title">All Your URL's</h1>
        <Link href="/" className="btn btn-secondary">
          Go to Home Page
        </Link>
        <div className="table-wrapper">
          <table className="url-table">
            <thead>
              <tr>
                <th>Original URL</th>
                <th>Short URL</th>
              </tr>
            </thead>
            <tbody>
              {urls.urls && Array.isArray(urls?.urls) &&
                urls.urls.map(
                  (url: {
                    _id: string;
                    originalUrl: string;
                    shortUrl: string;
                  }) => {
                    return (
                      <tr key={url._id}>
                        <td>{url.originalUrl}</td>
                        <td>
                          <a
                            href={`/${url.shortUrl}`}
                            target="_blank"
                            className="link-primary"
                          >
                            {`${process.env.NEXT_PUBLIC_BASE_URL}/${url.shortUrl}`}
                          </a>
                        </td>
                      </tr>
                    );
                  }
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}