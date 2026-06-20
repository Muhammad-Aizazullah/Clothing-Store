// 20/06/2026
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HERO_IMAGE = 'https://media.base44.com/images/public/6a35766791f303e104782bbe/5320903cc_generated_17c2fd35.png';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-end overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Mythic Store — Premium menswear editorial"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[120rem] mx-auto px-[5vw] pb-16 md:pb-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-background/60 text-xs tracking-[0.4em] uppercase mb-3 font-body">
            New Season Collection
          </p>
          <h1 className="font-display text-background text-4xl md:text-6xl lg:text-7xl tracking-[0.15em] uppercase leading-tight max-w-2xl">
            Define Your
            <br />
            Legend
          </h1>
          <p className="text-background/60 text-sm md:text-base max-w-md mt-4 mb-8 font-body leading-relaxed">
            Precision-crafted essentials for the modern man. Where fabric meets mythology.
          </p>
          <Link
            to="/?featured=true"
            className="inline-flex items-center bg-background text-foreground px-8 py-4 text-xs tracking-[0.3em] uppercase font-medium hover:bg-background/90 transition-all duration-500"
          >
            Shop Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}