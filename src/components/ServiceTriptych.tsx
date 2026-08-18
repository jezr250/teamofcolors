"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

const tiles = [
  {
    href: "#order",
    img: "https://images.unsplash.com/photo-1714828180412-063a6eab7bae?w=900&auto=format&fit=crop&q=85",
    alt: "モルタル造形制作",
    label: "モルタル造形制作",
    labelEn: "MORTAR SCULPTURE",
  },
  {
    href: "#order",
    img: "https://images.unsplash.com/photo-1531973968078-9bb02785f13d?w=900&auto=format&fit=crop&q=85",
    alt: "店舗内装",
    label: "内装・インテリア",
    labelEn: "INTERIOR DESIGN",
  },
  {
    href: "#order",
    img: "https://images.unsplash.com/photo-1578922427288-a47338083a57?w=900&auto=format&fit=crop&q=85",
    alt: "エイジング塗装",
    label: "エイジング塗装",
    labelEn: "AGING PAINT",
  },
];

export default function ServiceTriptych() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          ref.current?.querySelectorAll(".tile-item").forEach((el, i) => {
            setTimeout(() => el.classList.add("visible"), i * 120);
          });
          observer.disconnect();
        }),
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="service"
      ref={ref}
      className="flex flex-col md:flex-row"
      style={{ height: "clamp(300px, 70vh, 700px)" }}
    >
      {tiles.map((tile, i) => (
        <a
          key={tile.labelEn}
          href={tile.href}
          className="triptych-item tile-item opacity-0"
          style={{
            transition: `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`,
            transform: "translateY(20px)",
          }}
        >
          <Image
            src={tile.img}
            alt={tile.alt}
            fill
            className="object-cover transition-transform duration-900 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="triptych-overlay">
            <div className="text-center">
              <p className="font-label text-[11px] tracking-[0.4em] text-gold mb-2 uppercase">
                {tile.labelEn}
              </p>
              <p className="font-heading italic text-2xl tracking-[0.08em] silver-grad">
                {tile.label}
              </p>
            </div>
          </div>
        </a>
      ))}
    </section>
  );
}
