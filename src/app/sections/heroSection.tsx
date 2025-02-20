"use client";
import React from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import styles from "../style.module.css";

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Transform Your Lead Response Time{" "}
          <span style={{ color: "#93c5fd" }}>Into Your Competitive Edge</span>
        </h1>

        <p className={styles.heroDescription}>
          Respond to leads in seconds, not hours. Increase conversion rates by up to 35% 
          with AI-powered lead engagement.
        </p>

        <div className={styles.heroButtons}>
          <button className={`${styles.ctaButton} ${styles.primary}`}>
            Start Free Trial
            <ArrowRight size={20} style={{ marginLeft: "0.5rem" }} />
          </button>
          <button className={styles.secondaryButton}>
            Watch Demo
          </button>
        </div>

        <div className={styles.heroFeatures}>
          {[
            "Response time under 1 minute",
            "35% higher conversion rate",
            "AI-powered engagement"
          ].map((feature, index) => (
            <div key={index} className={styles.featureItem}>
              <CheckCircle size={20} />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;