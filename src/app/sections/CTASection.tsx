"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import styles from "../style.module.css";

const CTASection = () => {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaContent}>
        <h2>Ready to Transform Your Lead Response?</h2>
        <p>
          Join thousands of businesses who have already increased their conversion 
          rates with our platform.
        </p>
        <button className={styles.ctaButton}>
          Start Free Trial
          <ArrowRight size={20} style={{ marginLeft: "0.5rem" }} />
        </button>
      </div>
    </section>
  );
};

export default CTASection;