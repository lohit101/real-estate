# 1o1 Realtor

Real estate website and CMS built with Next.js, React, and Supabase.

## Development

Use Node.js 24 LTS and npm 11. The project includes `.nvmrc` and a committed npm lockfile.

```bash
nvm use
npm ci
npm run dev
```

Configure Supabase as described below, then open http://localhost:3000.

```bash
npm run check  # ESLint, route generation, TypeScript, and regression tests
npm run build  # Production build
npm start      # Serve the production build
```

## Dependency compatibility

Upgraded to Next.js 16.3.5, React 19.3.0, Tailwind CSS 4.3.3, and the latest compatible releases of the remaining dependencies. The lockfile records exact versions.

- TypeScript stays on 6.0.x because the current TypeScript ESLint parser supports versions below 6.1; TypeScript 7 also removes the JavaScript compiler API used by the search regression tests.
- ESLint stays on 9.39.5 because the current React, import, and accessibility plugins do not declare ESLint 10 compatibility. ESLint 9 is upstream-deprecated; upgrade when these plugins support 10.
- Node types track the supported Node 24 runtime rather than Node 26.
- Tailwind configuration now lives in `app/globals.css`; PostCSS uses `@tailwindcss/postcss`. Tailwind 4 requires modern browsers (Safari 16.4+, Chrome 111+, Firefox 128+).
- Supabase authentication uses `@supabase/ssr` in place of the deprecated Next.js auth helper. Existing users may need to sign in again after the cookie migration.
- Lint retains existing external-image performance warnings. The synchronous effect-state heuristic is disabled for the existing client fetching/subscription patterns; hook order and dependency checks remain enabled.

Migration references: [Next.js 16](https://nextjs.org/docs/app/guides/upgrading/version-16), [Tailwind CSS 4](https://tailwindcss.com/docs/upgrade-guide), [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/migrating-to-ssr-from-auth-helpers).

## Admin panel

- Local login: `http://localhost:3000/admin/login`
- Signed-in dashboard: `/admin/dashboard`
- Other admin routes: `/admin/listings`, `/admin/messages`, `/admin/add`, and `/admin/edit/[id]`.
- Authentication uses an existing Supabase user's email and password. This repository does not define default admin credentials.

Before running the app, configure `.env.local` with your project's values:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

The public listings, contact forms, and admin authentication require that configuration.

## Visual styling

Public-page refinements live in `app/globals.css` under `.site-surface`, with named hooks for the navigation, search, property cards, expertise, categories, FAQ, and footer. They preserve the existing section order, dimensions, grids, breakpoints, images, and Montserrat font. The CMS has its own scoped visual system in `app/admin/admin.css`.


## CMS workspace

- **Dashboard:** property and featured counts, enquiries received in the last seven days, combined asking value, category/possession breakdowns, and a checklist of listings missing essential details.
- **Listings:** all properties (including non-featured listings), search by title/city/builder/type/ID, category and city filters, price sorting, pagination, homepage feature controls, public previews, and confirmed deletion.
- **Messages:** searchable enquiries, date filters, pagination, and email reply links. Reply links open your email app; the CMS does not track reply status.
- **Add / edit:** a shared property form with numeric validation, photo previews/removal, a 10-photo limit, image type/size validation, and recoverable upload/save errors.

These features use the existing `listings`, `messages`, and `property-images` resources; no database migration is required. Dashboard counts reflect records accessible to the signed-in account. Asking value is the sum of listing prices, not sales revenue.

Run the focused CMS data checks with Node 24:

```bash
node --test tests/admin-data.test.cjs
```


## Public property search

The homepage form, category tiles, and results page share `lib/property-search.ts` and the CMS property options.

- Every selected category, type, city, price bound, and amenity must match. Empty fields impose no restriction, and “Any price” has no upper limit.
- Category changes clear incompatible property types. Category tiles link to their actual property type, and category navigation has no implicit price ceiling.
- Price limits are inclusive. Listings without a known positive price appear as “Price on request”; budget searches exclude them, and price sorting places them last.
- Results offer newest, price ascending/descending, featured-first, and alphabetical sorting. Filters, sorting, and result pages are encoded in the URL for sharing, refresh, and browser history.
- The public catalog loads in batches of 500, then applies the shared filter/sort engine and displays 24 results per page. There is no silent 1,000-row cutoff. Newest uses the existing numeric listing ID, since the schema does not establish a listing creation timestamp.
- Loading failures, invalid URL filters, and zero matches have distinct states and recovery actions.

Run all data-logic regression checks:

```bash
node --test tests/*.test.cjs
```
