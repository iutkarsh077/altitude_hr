import React from "react";

export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://altitude.ai/#organization",
        "name": "Altitude",
        "url": "https://altitude.ai",
        "logo": "https://altitude.ai/logo.png",
        "description": "AI-powered candidate intelligence platform for vector resume matching and semantic hiring search.",
        "sameAs": [
          "https://twitter.com/altitude_ai",
          "https://linkedin.com/company/altitude-ai",
          "https://github.com/altitude-ai"
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://altitude.ai/#application",
        "name": "Altitude Candidate AI",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Natural language resume search and vector matching platform that helps recruiters and hiring managers find top candidates from their PDF resume library in seconds.",
        "featureList": [
          "Semantic Vector Resume Search",
          "Automated PDF Text Extraction",
          "AI Match Scoring & Radar",
          "Natural Language Querying",
          "Skill Tagging & Candidate Summarization"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://altitude.ai/#website",
        "url": "https://altitude.ai",
        "name": "Altitude",
        "publisher": {
          "@id": "https://altitude.ai/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://altitude.ai/chat?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://altitude.ai/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does Altitude's AI candidate matching work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Altitude converts uploaded candidate resumes into high-dimensional vector embeddings using OpenAI and ChromaDB. When a recruiter searches in plain natural language, the system semantically ranks candidates based on context, experience, and skill relevance rather than basic keyword counts."
            }
          },
          {
            "@type": "Question",
            "name": "What file formats does Altitude support for resume parsing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Altitude supports PDF resume uploads up to 10MB. The system automatically extracts text, analyzes work experience and skills, and indexes the document for instant retrieval."
            }
          },
          {
            "@type": "Question",
            "name": "Can I search for candidates using natural language?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can search with conversational prompts such as 'Senior Fullstack Engineer with 5+ years of React and AWS experience' or 'Product Designer who has worked in fintech', and Altitude will surface the highest-matching candidates."
            }
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
