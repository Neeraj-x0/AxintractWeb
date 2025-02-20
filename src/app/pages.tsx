"use client";
import React from "react";
import HeroSection from "./sections/heroSection";
import FeaturesSection from "./sections/FeaturesSection";
import StatisticsSection from "./sections/StatisticsSection";
import CTASection from "./sections/CTASection";
import styles from "./style.module.css";
const LandingPage = () => {
  return (
    <div className={styles.pageWrapper}>
      <HeroSection />
      <FeaturesSection />
      <StatisticsSection />
      <CTASection />
    </div>
  );
};

export default LandingPage;
