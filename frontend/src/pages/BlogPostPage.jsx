import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import { ArrowLeft, ChevronDown, Link2 } from "lucide-react";
import { toast } from "sonner";
import BlogLayout from "@/components/blog/BlogLayout";
import { getBlogExtensions } from "@/components/blog/BlogExtension";
import { API } from "@/constants";

import "@/components/blog/BlogEditor.css";
import "@/components/blog/BlogReader.css"; // must come AFTER BlogEditor.css

const SITE_NAME = "Trading Ke Khiladi";

const fmtDate = (iso, month = "long") =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month, year: "numeric" });

const readingTime = (html = "") => {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const absUrl = (u) => (!u ? "" : /^https?:\/\//.test(u) ? u : `${window.location.origin}${u}`);

// Only FAQs that have both a question and an answer are shown.
const cleanFaqs = (faqs) =>
  (Array.isArray(faqs) ? faqs : []).filter((f) => f && f.question && f.answer);

// Read-only TipTap: same schema as the admin editor, so images/alignment look the same.
function BlogContent({ html }) {
  const editor = useEditor({
    extensions: getBlogExtensions({ editable: false }),
    content: html,
    editable: false,
    editorProps: { attributes: { class: "blog-editor-content blog-reader" } },
  });
  return <EditorContent editor={editor} />;
}

// Click-to-open FAQ list with bullet indicators and improved spacing.
function BlogFaq({ faqs }) {
  const [open, setOpen] = useState(null); // index of the open item, or null

  return (
    <section className="mt-14 border-t border-white/10 pt-10" data-testid="blog-faq">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-primary">FAQ</p>
      <h2 className="mb-6 font-display text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">
        Frequently asked questions
      </h2>

      <div className="space-y-4">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              data-testid={`blog-faq-item-${i}`}
              className={`border transition-all duration-200 rounded-lg overflow-hidden ${
                isOpen
                  ? "border-primary/60 bg-white/[0.04] shadow-lg shadow-primary/5"
                  : "border-white/10 bg-white/[0.02] hover:border-white/30"
              }`}
            >
              <h3 className="m-0">
                <button
                  type="button"
                  id={`faq-q-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Bullet / Accent Indicator */}
                    <span className={`h-2 w-2 shrink-0 rounded-full transition-colors ${
                      isOpen ? "bg-primary" : "bg-white/30"
                    }`} />
                    <span className="font-display text-base font-semibold leading-snug text-white sm:text-lg">
                      {f.question}
                    </span>
                  </div>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-primary transition-transform duration-300 ${
                    isOpen ? "rotate-180 border-primary/40 bg-primary/10" : ""
                  }`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>
              </h3>

              <div
                id={`faq-a-${i}`}
                role="region"
                aria-labelledby={`faq-q-${i}`}
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-white/5 px-6 pt-4 pb-6 text-[15px] leading-relaxed text-white/70">
                    <p className="whitespace-pre-line m-0">
                      {f.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Lightweight SEO: title, meta tags, canonical, JSON-LD (cleaned up when leaving the page).
function useBlogSeo(blog) {
  useEffect(() => {
    if (!blog) return undefined;

    const url = blog.canonical_url || `${window.location.origin}/blog/${blog.slug}`;
    const title = blog.meta_title || `${blog.title} | ${SITE_NAME}`;
    const description = blog.meta_description || blog.excerpt || "";
    const image = absUrl(blog.og_image || blog.cover_image);
    const published = blog.published_at || blog.created_at;

    const prevTitle = document.title;
    document.title = title;

    const added = [];
    const setMeta = (attr, key, content) => {
      if (!content) return;
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
        added.push(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("name", "robots", (blog.index_status || "index") === "noindex" ? "noindex, follow" : "index, follow");
    setMeta("property", "og:type", "article");
    setMeta("property", "og:title", blog.og_title || title);
    setMeta("property", "og:description", blog.og_description || description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", image);
    setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");

    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = url;
    document.head.appendChild(canonical);
    added.push(canonical);

    const addJsonLd = (obj) => {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.text = JSON.stringify(obj);
      document.head.appendChild(el);
      added.push(el);
    };

    addJsonLd({
      "@context": "https://schema.org",
      "@type": blog.schema_type || "BlogPosting",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      headline: (blog.h1 || blog.title).slice(0, 110),
      description,
      ...(image ? { image: [image] } : {}),
      author: { "@type": "Person", name: blog.author || SITE_NAME },
      publisher: { "@type": "Organization", name: SITE_NAME },
      datePublished: published,
      dateModified: blog.updated_at || published,
    });

    // FAQ structured data, so Google can show the questions in search results.
    const faqs = cleanFaqs(blog.faqs);
    if (faqs.length) {
      addJsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      });
    }

    return () => {
      document.title = prevTitle;
      added.forEach((el) => el.parentNode && el.parentNode.removeChild(el));
    };
  }, [blog]);
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [more, setMore] = useState([]);
  const [state, setState] = useState("loading"); // loading | ready | notfound

  useBlogSeo(blog);

  useEffect(() => {
    setState("loading");
    setBlog(null);
    window.scrollTo(0, 0);

    axios
      .get(`${API}/blogs/${slug}`)
      .then((res) => { setBlog(res.data.blog); setState("ready"); })
      .catch(() => setState("notfound"));

    axios
      .get(`${API}/blogs`)
      .then((res) => setMore((res.data.blogs || []).filter((b) => b.slug !== slug).slice(0, 3)))
      .catch(() => setMore([]));
  }, [slug]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const published = blog && (blog.published_at || blog.created_at);
  const showUpdated = useMemo(
    () =>
      blog && blog.updated_at && published &&
      new Date(blog.updated_at) - new Date(published) > 24 * 3600 * 1000,
    [blog, published]
  );
  const faqs = useMemo(() => cleanFaqs(blog?.faqs), [blog]);

  return (
    <BlogLayout>
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-12 sm:px-6" data-testid="blog-post-page">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>

        {state === "loading" && <p className="mt-12 text-white/60">Loading article…</p>}

        {state === "notfound" && (
          <div className="mt-12" data-testid="blog-not-found">
            <h1 className="mb-3 font-display text-3xl text-white">Article not found</h1>
            <p className="text-white/60">It may have been moved or unpublished.</p>
          </div>
        )}

        {state === "ready" && blog && (
          <article className="mt-10" data-testid="blog-article">
            <header className="mb-10">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
                {blog.category && <>{blog.category} · </>}
                {fmtDate(published)} · {readingTime(blog.content)} min read
              </p>
              <h1 className="mb-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
                {blog.h1 || blog.title}
              </h1>
              {blog.excerpt && <p className="text-xl leading-relaxed text-white/70">{blog.excerpt}</p>}
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
                By {blog.author || SITE_NAME}
                {showUpdated && <> · Updated {fmtDate(blog.updated_at)}</>}
              </p>
            </header>

            {blog.cover_image && (
              <img
                src={blog.cover_image}
                alt={blog.cover_alt || blog.title}
                className="mb-12 aspect-[16/9] w-full border border-white/10 object-cover"
              />
            )}

            <BlogContent key={blog.blog_id + blog.updated_at} html={blog.content} />

            {faqs.length > 0 && <BlogFaq faqs={faqs} />}

            {blog.tags && (
              <p className="mt-10 flex flex-wrap gap-2">
                {blog.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                  <span key={t} className="border border-white/15 px-3 py-1 text-[11px] uppercase tracking-widest text-white/60">
                    {t}
                  </span>
                ))}
              </p>
            )}

            <footer className="mt-12 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">{SITE_NAME}</span>
              <button
                onClick={copyLink}
                className="inline-flex items-center gap-2 border border-white/20 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 transition-colors hover:border-white hover:text-white"
              >
                <Link2 className="h-3.5 w-3.5" /> Copy link
              </button>
            </footer>
          </article>
        )}
      </main>

      {state === "ready" && more.length > 0 && (
        <section className="border-t border-white/10 bg-white/[0.02]" data-testid="blog-more">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="mb-8 text-[11px] font-bold uppercase tracking-[0.25em] text-primary">More articles</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((b) => (
                <Link
                  key={b.blog_id}
                  to={`/blog/${b.slug}`}
                  className="group flex flex-col border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-primary/60"
                >
                  <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-white/50">
                    {fmtDate(b.published_at || b.created_at, "short")}
                  </p>
                  <h3 className="mb-3 font-display text-lg leading-snug text-white">{b.title}</h3>
                  {b.excerpt && <p className="mb-4 line-clamp-2 text-sm text-white/60">{b.excerpt}</p>}
                  <span className="mt-auto text-xs font-bold uppercase tracking-widest text-white/80 group-hover:text-primary">
                    Read →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </BlogLayout>
  );
}