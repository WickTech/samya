import { GALLERY_POSTS } from "@/data/gallery";

export function GalleryGrid() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {GALLERY_POSTS.map((post) => (
        <li key={post.id}>
          <a
            href={post.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-square overflow-hidden rounded-2xl bg-plum"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/85 via-ink/10 to-transparent p-3 text-[0.72rem] leading-snug text-cream opacity-0 transition-opacity group-hover:opacity-100">
              {post.caption}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
