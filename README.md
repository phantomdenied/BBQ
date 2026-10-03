# Momma Lo's BBQ — website

A static redesign of [mommalosbbq.com](https://mommalosbbq.com): plain HTML, CSS and a small JavaScript file. It has no build step and no dependencies, and can be hosted anywhere that serves static files (Netlify, Cloudflare Pages, GitHub Pages, or any web host).

```
index.html        Home: hero, signature food, menu preview, story, gallery, hours & location, contact
menu.html         Full menu page
404.html          Not-found page (uses root-absolute paths so it works at any URL)
assets/css/       styles.css (all styles; design tokens at the top)
assets/js/        main.js (mobile nav, open/closed status, scroll reveals, contact form)
assets/img/       Optimised images (WebP + JPEG fallbacks, several widths each)
assets/fonts/     Self-hosted Fraunces, Barlow and Barlow Condensed (latin subset)
robots.txt, sitemap.xml, site.webmanifest
```

Preview locally with any static server, e.g. `npx http-server .` and open http://localhost:8080.

## Content source

All restaurant facts come from the original GoDaddy site: name, logo, address, phone, email, hours, "Fried Chicken Fridays", the Philosophy, Pitmasters and Community text, the photos, and the Facebook and Yelp links. Nothing else was added. The original site has **no menu, prices, online ordering, reservations or catering information**, so the new site doesn't claim any of those.

The GoDaddy stock photo used on the old site was left out because its licence is tied to GoDaddy's builder. The "Momma Lo cooking ribs" photo is credited to E.M. Marcus, as it was on the original site.

## Common updates

**Hours** live in four places. Update all four together:
1. `index.html`: the hours table (`#visit`), the hero summary line, the footer `<dl>` and the JSON-LD `openingHoursSpecification`
2. `menu.html`: the hours table in the sidebar and the footer
3. `404.html`: the footer
4. `assets/js/main.js`: the `HOURS` array (drives the live "Open now / Closed" badge)

**Menu items**: in `menu.html`, copy a `.menu-item` block. Add a price with `<span class="price">$00</span>` directly after the `<h3>`. Add the item to the `Menu` JSON-LD in the page head too. The homepage preview (`#menu` in `index.html`) should show a few highlights, not the whole menu.

**Online ordering**: if the restaurant adds an ordering service, point the primary hero button and the first button in the mobile action bar at it, and relabel them "Order Online".

**Contact form**: there is no server, so the form opens the visitor's email app addressed to mommalobbq@gmail.com. To receive submissions directly, point the form's `action` at a form service (Formspree, Netlify Forms, etc.) and remove the `mailto` handler in `main.js`.
