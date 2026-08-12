export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  type: string;
  excerpt: string;
  readTime: number;
}

export interface BlogPostFull extends BlogPostMeta {
  metaDescription: string;
  keywords: string;
  html: string;
  quote: { text: string; by: string };
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}

export async function fetchBlogIndex(): Promise<BlogPostMeta[]> {
  const res = await fetch('/blog-data/index.json');
  if (!res.ok) throw new Error('Failed to load blog index');
  return res.json();
}

export async function fetchBlogPost(slug: string): Promise<BlogPostFull> {
  const res = await fetch(`/blog-data/${slug}.json`);
  if (!res.ok) throw new Error('Post not found');
  return res.json();
}

export function formatPostDate(d: string): string {
  return new Date(`${d}T12:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
