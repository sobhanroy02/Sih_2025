"use client";

import React from "react";
import Link from "next/link";
import styles from "./landing.module.css";
import TypingEffect from "@/components/TypingEffect";

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* Navbar: transparent off-white with logo + brand on left and links on right */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.left}>
            <div className={styles.logoBox} aria-hidden>
              <img src="/icons/logo.png" alt="CitiZen logo" className={styles.logoImg} />
            </div>
            <div className={styles.brand}>
              <div className={styles.brandName}>
                <span className={styles.citi}>CitiZen</span>
               
              </div>
              <div className={styles.tagline} style={{display:'none'}}>Empower Your City</div>
            </div>
          </div>

          <nav className={styles.nav} aria-label="Main navigation">
            <Link href="/about" className={styles.navLink}>About</Link>
            <Link href="/impact" className={styles.navLink}>Impact</Link>
            <Link href="/help" className={styles.navLink}>Help</Link>
            <Link href="/contact" className={styles.contactBtn} aria-label="Contact">
              {/* phone SVG icon */}
              <svg
                className={styles.contactIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 30 24"
                role="img"
                aria-hidden="true"
              >
                <path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c.35.13.73.2 1.12.2a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 .39.07.77.2 1.12a1 1 0 01-.24 1.01l-2.2 2.23z" />
              </svg>
            </Link>
            <label htmlFor="lang" className={styles.langLabel}>
              <select id="lang" name="lang" className={styles.langSelect} aria-label="Select language">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="bn">Bengali</option>
              </select>
            </label>
          </nav>
        </div>
      </header>

      <main className={styles.hero}>
        <div className={styles.heroInner}>
          <TypingEffect
            firstLine="Empower Your"
            secondLine="community. Transform your city"
          />

          <br />

          <p className={styles.subheading}>CitiZen is your platform for civic issue.</p>

          <div className={styles.ctaRow}>
            <Link href="/signup" className={styles.cta}>
              Take Action
            </Link>
          </div>
          <div className={styles.aboutLines}>
            <p className={styles.aboutLine}>CitiZen connects residents with their local government to get things fixed fast.</p>
            <p className={styles.aboutLine}>Report civic issues with photos and precise location in a few taps.</p>
            <p className={styles.aboutLine}>Track status updates and see verified resolutions for transparency.</p>
            <p className={styles.aboutLine}>Collaborate with neighbors and local workers to improve your community.</p>
            <p className={styles.aboutLine}>Join thousands of citizens making measurable impact in their city.</p>
          </div>
        </div>
      </main>
      {/* background image controlled via CSS module (landing.module.css) */}
    </div>
  );
}
