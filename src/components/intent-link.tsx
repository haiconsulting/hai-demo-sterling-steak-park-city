"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

/**
 * A Link to a route with different fonts and CSS (Sterling site <-> FOH pitch).
 * Viewport prefetch would preload that route's fonts and stylesheets, which the
 * current page never uses (browsers warn after a few seconds). This prefetches
 * on hover, focus or touch instead, still ahead of the click.
 */
export function IntentLink({ href, onPointerEnter, onFocus, onTouchStart, ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const router = useRouter();
  const prefetch = () => router.prefetch(href);
  return (
    <Link
      href={href}
      prefetch={false}
      onPointerEnter={(e) => {
        prefetch();
        onPointerEnter?.(e);
      }}
      onFocus={(e) => {
        prefetch();
        onFocus?.(e);
      }}
      onTouchStart={(e) => {
        prefetch();
        onTouchStart?.(e);
      }}
      {...rest}
    />
  );
}
