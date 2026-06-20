// 20/06/2026
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoryBanner from '@/components/home/CategoryBanner';
import BrandStory from '@/components/home/BrandStory';
import AllProducts from '@/components/home/AllProducts';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <CategoryBanner />
      <AllProducts />
      <BrandStory />
    </>
  );
}