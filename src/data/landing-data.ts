export type NavHref = "/" | "/about" | "/portfolio" | "/blog";
export type SocialLabel = "X" | "LinkedIn" | "GitHub";
export type NavItem = LandingData["navigation"][number];
export type SocialLink = LandingData["socials"][number];

export type LandingData = {
  metadata: {
    title: string;
    description: string;
  };
  navigation: readonly {
    label: string;
    href: NavHref;
  }[];
  socials: readonly {
    label: SocialLabel;
    iconSrc: `/icons/social/${string}.svg`;
    href: `https://${string}`;
  }[];
  hero: {
    srTitle: string;
    signatureImgSrc: `/images/${string}`;
    heroImgSrc: `/images/${string}`;
    intro: {
      highlight: string;
      text: string;
    };
    tagline: string;
    stack: readonly string[];
    watermark: string;
  };
};



export const landingData = {
  metadata: {
    title: "Noah Joeris | Software Engineer",
    description:
      "Cypherpunk protecting human freedom with software. React, Rust, Bitcoin.",
  },
  navigation: [
    {
      label: "HOME",
      href: "/",
    },
    {
      label: "ABOUT ME",
      href: "/about",
    },
    {
      label: "PORTFOLIO",
      href: "/portfolio",
    },
    {
      label: "BLOG",
      href: "/blog",
    },
  ],
  socials: [
    {
      label: "X",
      iconSrc: "/icons/social/x.svg",
      href: "https://x.com/",
    },
    {
      label: "LinkedIn",
      iconSrc: "/icons/social/linkedin.svg",
      href: "https://linkedin.com/",
    },
    {
      label: "GitHub",
      iconSrc: "/icons/social/github.svg",
      href: "https://github.com/",
    },
  ],
  hero: {
    srTitle: "Noah Joeris - Software Engineer",
    signatureImgSrc: "/images/signature.png",
    heroImgSrc: "/images/noah-hero.avif",
    intro: {
      highlight: "Cypherpunk",
      text: "protecting human freedom with software",
    },
    tagline: "- leading by example through discipline",
    stack: ["React", "Rust", "Bitcoin"],
    watermark: "NOAH JOERIS",
  },
} as const satisfies LandingData;
