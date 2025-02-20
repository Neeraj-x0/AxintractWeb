"use client";
import React from "react";
import { Users, Clock, TrendingUp } from "lucide-react";
import styles from "../style.module.css";

const StatisticsSection = () => {
  const stats = [
    {
      icon: <Users size={24} />,
      value: "10,000+",
      label: "Active Users",
      increase: "+127%"
    },
    {
      icon: <Clock size={24} />,
      value: "45 sec",
      label: "Average Response Time",
      increase: "-75%"
    },
    {
      icon: <TrendingUp size={24} />,
      value: "35%",
      label: "Conversion Rate Increase",
      increase: "+12%"
    }
  ];

  return (
    <section className={styles.statsSection}>
      <div className={styles.gridContainer}>
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`${styles.statCard} ${styles.appearOnScroll}`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={styles.statIncrease}>{stat.increase}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatisticsSection;