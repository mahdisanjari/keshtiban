import { faqs } from "@/lib/content";
import { SITE_URL, brand, contact } from "@/lib/site";

function serialize(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Schema.org — فقط اطلاعاتی که واقعاً در سایت وجود دارد. */
export function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: brand.name,
    alternateName: brand.nameEn,
    url: SITE_URL,
    description:
      "تأمین‌کننده کالا و ملزومات کشتی‌های تجاری (Ship Chandlery) شامل روغن، رنگ، مواد شیمیایی، آذوقه، پوشاک کار و تجهیزات ایمنی، در بنادر شمال و جنوب ایران.",
    slogan: "تأمین کالا و ملزومات کشتی‌های تجاری، در بنادر ایران",
    areaServed: { "@type": "Country", name: "Iran" },
    knowsAbout: [
      "Ship Chandlery",
      "Marine lubricants",
      "Marine paints and coatings",
      "Marine chemicals",
      "Ship provisions",
      "Marine safety equipment (LSA, FFA)",
    ],
    ...(contact.email || contact.phone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            availableLanguage: ["fa", "en"],
            ...(contact.email ? { email: contact.email } : {}),
            ...(contact.phone ? { telephone: contact.phone } : {}),
          },
        }
      : {}),
    ...(contact.address ? { address: { "@type": "PostalAddress", streetAddress: contact.address, addressCountry: "IR" } } : {}),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: brand.name,
    inLanguage: "fa-IR",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      {[organization, website, faq].map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialize(d) }}
        />
      ))}
    </>
  );
}
