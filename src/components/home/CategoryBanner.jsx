// 20/06/2026
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const COLLECTION_IMAGE = 'https://media.base44.com/images/public/6a35766791f303e104782bbe/5d8573cae_generated_2c1cc3cb.png';

export default function CategoryBanner() {
  return (
    <section className="px-[5vw] max-w-[120rem] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative overflow-hidden"
      >
        <div className="aspect-[21/9] md:aspect-[3/1]">
          <img
            src={COLLECTION_IMAGE}
            alt="Mythic Store seasonal collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/40" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-background/60 text-xs tracking-[0.4em] uppercase mb-3 font-body">
            Seasonal Edit
          </p>
          <h2 className="font-display text-background text-3xl md:text-5xl tracking-[0.15em] uppercase mb-6">
            The Essentials
          </h2>
          <Link
            to="/"
            className="inline-flex items-center bg-background text-foreground px-8 py-3.5 text-xs tracking-[0.3em] uppercase font-medium hover:bg-background/90 transition-all duration-500"
          >
            Explore
          </Link>
        </div>
      </motion.div>
    </section>
  );
}