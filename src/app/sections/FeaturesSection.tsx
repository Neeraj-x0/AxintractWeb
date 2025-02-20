"use client";
import React, { useEffect, useRef } from "react";
import { MessageSquare, Clock, TrendingUp } from "lucide-react";
import styles from "../style.module.css";

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(`.${styles.appearOnScroll}`);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Clock size={24} />,
      title: "Lightning-Fast Response",
      description: "Engage leads within seconds of their first contact."
    },
    {
      icon: <MessageSquare size={24} />,
      title: "AI-Powered Conversations",
      description: "Smart responses that feel personal and convert better."
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Real-Time Analytics",
      description: "Track and optimize your lead engagement performance."
    }
  ];

  return (
    <section className={styles.featureSection} ref={sectionRef}>
      <div className={styles.sectionContent}>
        <div className={`${styles.sectionHeader} ${styles.appearOnScroll}`}>
          <h2>Features that Drive Results</h2>
          <p>Our platform combines speed, intelligence, and analytics to help you convert more leads.</p>
        </div>

        <div className={styles.gridContainer}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`${styles.featureCard} ${styles.appearOnScroll}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;