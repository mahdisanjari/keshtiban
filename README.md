# کشتی‌بان — لندینگ‌پیج

لندینگ‌پیج فارسی/RTL شرکت کشتی‌بان (Ship Chandlery). Next.js (App Router) · TypeScript · Tailwind CSS v4 · Motion · Lucide.

## اجرا

```bash
npm install
cp .env.example .env.local   # و مقادیر واقعی را وارد کنید
npm run dev
```

## چیزهایی که باید با اطلاعات واقعی جایگزین شوند

| مورد | محل |
| --- | --- |
| ایمیل، واتس‌اپ، تلفن، نشانی | `.env.local` (متغیرهای `NEXT_PUBLIC_*`) |
| آدرس دامنه (canonical / sitemap / OG) | `NEXT_PUBLIC_SITE_URL` |
| اتصال فرم به ایمیل/CRM | `INQUIRY_WEBHOOK_URL` ← `app/api/inquiry/route.ts` |
| لوگوی رسمی | `brand.logoSrc` در `lib/site.ts` (فایل را در `public/brand/` بگذارید) |
| عکس واقعی Hero | `brand.heroImage` در `lib/site.ts` (فایل را در `public/images/` بگذارید) |
| دو ناحیه‌ی فعالیت (شمال/جنوب) | `coastRegions` در `lib/content.ts` |
| متن‌ها، دسته‌ها، FAQ | `lib/content.ts` |
| تصویر Open Graph | `app/opengraph-image.png` (۱۲۰۰×۶۳۰) |
| فاوآیکون | `app/icon.png` یا `app/icon.svg` |
