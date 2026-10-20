import { MapPin, Ship, ShieldCheck, Tag } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

const items = [
  {
    icon: MapPin,
    title: "پوشش بنادر ایران",
    text: "بنادر شمال و جنوب، با تمرکز بر خلیج فارس",
  },
  {
    icon: Ship,
    title: "ویژه کشتی‌های تجاری",
    text: "کانتینری، نفت‌کش، حمل گاز و سایر شناورها",
  },
  {
    icon: ShieldCheck,
    title: "کیفیت قابل‌اعتماد",
    text: "کالای متناسب با نیاز عملیاتی هر کشتی",
  },
  {
    icon: Tag,
    title: "قیمت رقابتی",
    text: "پیشنهاد شفاف برای هر درخواست تأمین",
  },
];

export function TrustBar() {
  return (
    <section aria-label="مزیت‌های کشتی‌بان" className="relative bg-ink-900 text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            <StaggerItem
              key={title}
              className="group flex items-start gap-4 border-b border-white/10 py-7 sm:px-5 lg:border-b-0 lg:border-s lg:px-7 lg:py-9 lg:first:border-s-0 lg:first:ps-0 lg:last:pe-0"
            >
              <span className="mt-1 inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-white/15 text-aqua-400 transition-colors duration-300 group-hover:border-aqua-400/60 group-hover:bg-aqua-400/10">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-[1.02rem] font-bold">{title}</h3>
                <p className="mt-1 text-sm leading-7 text-steel-400">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
