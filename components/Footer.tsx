import { ContactChannels } from "@/components/ContactChannels";
import { En, Logo } from "@/components/ui/primitives";
import { serviceCategories } from "@/lib/content";
import { navItems } from "@/lib/site";

function persianYear() {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric" }).format(new Date());
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-white">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-8 text-steel-400">
              کشتی‌بان، تأمین‌کننده کالا و ملزومات کشتی‌های تجاری در بنادر شمال
              و جنوب ایران.
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-aqua-400">
              <En>Ship Chandlery · Marine Supplier Iran</En>
            </p>
          </div>

          <nav aria-label="کالاها و خدمات" className="lg:col-span-3">
            <h2 className="text-sm font-bold text-white">کالاها و خدمات</h2>
            <ul className="mt-5 space-y-3 text-sm text-steel-400">
              {serviceCategories.map((c) => (
                <li key={c.id}>
                  <a href="#services" className="transition-colors hover:text-aqua-300">
                    {c.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="پیوندهای سریع" className="lg:col-span-2">
            <h2 className="text-sm font-bold text-white">دسترسی سریع</h2>
            <ul className="mt-5 space-y-3 text-sm text-steel-400">
              {navItems.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="transition-colors hover:text-aqua-300">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faq" className="transition-colors hover:text-aqua-300">
                  پرسش‌های متداول
                </a>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="text-sm font-bold text-white">تماس با ما</h2>
            <div className="mt-5 text-sm">
              <ContactChannels tone="dark" />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-7 text-xs text-steel-500 sm:flex-row sm:items-center">
          <p>© {persianYear()} کشتی‌بان. تمامی حقوق محفوظ است.</p>
          <p>تأمین کالا و ملزومات کشتی‌های تجاری</p>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none relative -mb-[0.18em] select-none overflow-hidden text-center">
        <span
          lang="en"
          dir="ltr"
          className="block text-[clamp(3.5rem,17vw,15rem)] font-black uppercase leading-none tracking-[0.04em] text-transparent [-webkit-text-stroke:1px_rgb(140_192_240/0.14)]"
        >
          Kashtiban
        </span>
      </div>
    </footer>
  );
}
