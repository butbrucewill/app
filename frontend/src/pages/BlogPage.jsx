import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BlogLayout from "@/components/blog/BlogLayout";
import { API } from "@/constants";

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [state, setState] = useState("loading"); // loading | ready | error

  useEffect(() => {
    document.title = "Blog | Trading Ke Khiladi";
    axios
      .get(`${API}/blogs`)
      .then((res) => { setBlogs(res.data.blogs || []); setState("ready"); })
      .catch(() => setState("error"));
  }, []);

  return (
    <BlogLayout>
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6" data-testid="blog-list-page">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Learn</p>
        <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
          Blog
        </h1>
        <p className="mt-3 max-w-xl text-sm text-white/50">
          Trading lessons, market basics and updates from the Trading Ke Khiladi team.
        </p>

        {state === "loading" && <p className="mt-12 text-white/50">Loading…</p>}
        {state === "error" && <p className="mt-12 text-white/50">Couldn't load articles. Please try again.</p>}
        {state === "ready" && blogs.length === 0 && (
          <p className="mt-12 text-white/50" data-testid="blog-empty">No articles yet. Check back soon.</p>
        )}

        {state === "ready" && blogs.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((b) => (
              <Link
                key={b.blog_id}
                to={`/blog/${b.slug}`}
                data-testid={`blog-card-${b.slug}`}
                className="group flex flex-col border border-white/10 bg-white/[0.02] transition-colors hover:border-primary/60"
              >
                {b.cover_image ? (
                  <img
                    src={b.cover_image}
                    alt={b.cover_alt || b.title}
                    loading="lazy"
                    className="aspect-[16/9] w-full border-b border-white/10 object-cover"
                  />
                ) : (
                  <div className="aspect-[16/9] w-full border-b border-white/10 bg-gradient-to-br from-primary/20 to-transparent" />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                    {b.category && <>{b.category} · </>}
                    {fmtDate(b.published_at || b.created_at)}
                  </p>
                  <h2 className="font-display text-xl font-bold leading-snug text-white">{b.title}</h2>
                  {b.excerpt && <p className="mt-3 line-clamp-3 text-sm text-white/60">{b.excerpt}</p>}
                  <span className="mt-auto pt-5 text-xs font-bold uppercase tracking-widest text-white/80 transition-colors group-hover:text-primary">
                    Read →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </BlogLayout>
  );
}