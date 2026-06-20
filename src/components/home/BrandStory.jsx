// 20/06/2026
import React from 'react';
import { motion } from 'framer-motion';

export default function BrandStory() {
  return (
    <section className="py-20 md:py-32 px-[5vw] max-w-[120rem] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4 font-body">Our Philosophy</p>
          <h2 className="font-display text-3xl md:text-4xl tracking-[0.1em] uppercase leading-tight mb-6">
            Crafted for<br />the Bold
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 font-body">
            At Mythic, we believe clothing is armor. Each piece is meticulously designed with premium fabrics 
            and tailored fits that transform everyday wear into statements of quiet confidence.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-body">
            From the cotton fields to your wardrobe, every thread carries intention. No compromises on quality. 
            No shortcuts in craftsmanship. Just pure, purposeful design for the modern man.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="space-y-4">
            <div className="bg-secondary p-8 text-center">
              <span className="font-display text-3xl tracking-wide">500+</span>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2">Happy Clients</p>
            </div>
            <div className="bg-secondary p-8 text-center">
              <span className="font-display text-3xl tracking-wide">100%</span>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2">Premium Fabric</p>
            </div>
          </div>
          <div className="space-y-4 mt-8">
            <div className="bg-secondary p-8 text-center">
              <span className="font-display text-3xl tracking-wide">50+</span>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2">Unique Styles</p>
            </div>
            <div className="bg-secondary p-8 text-center">
              <span className="font-display text-3xl tracking-wide">COD</span>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2">Cash on Delivery</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}