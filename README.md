# NovaShop

Separate full-stack e-commerce project matching the requested architecture.

## Folders
- `frontend/` React + Vite. Deploy as Vercel Project 1.
- `backend/` Vercel serverless API. Deploy as Vercel Project 2.
- `backend/database/` Neon SQL schema and seed.

There is intentionally **no `frontend/vercel.json`**. Only `backend/vercel.json` exists.

## Local setup

### Backend
```bash
cd backend
npm install
copy .env.example .env
```
Set:
```env
DATABASE_URL=your_neon_url
JWT_SECRET=long_random_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=http://localhost:5173
```

### Neon
Open Neon SQL Editor and run:
1. `backend/database/schema.sql`
2. `backend/database/seed.sql`

### Frontend
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```
Set:
```env
VITE_API_URL=http://localhost:3001
```

The production frontend never uses relative `/api` URLs; requests use `VITE_API_URL`.

## First admin

Register normally. Signup always creates `user`, never admin. Then in Neon:
```sql
UPDATE users SET role='admin' WHERE email='your-admin-email@example.com';
```
Open `/admin-login`.

## Cloudinary

Admin product/banner forms send images to `/api/upload`. The backend uploads them to:
- `ecommerce/products`
- `ecommerce/banners`

Only secure Cloudinary URL/public ID values are stored in PostgreSQL. The Cloudinary API secret is backend-only. Upload validation allows image MIME types and limits the file to 5 MB.

## Manual backend Vercel deployment — no `npx vercel dev`

1. Vercel → Add New Project.
2. Import repository.
3. Set Root Directory to `backend`.
4. Deploy.
5. Add `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `FRONTEND_URL`.
6. Redeploy.
7. Test `https://YOUR-BACKEND.vercel.app/api/health`.
8. Expected response: `{"ok":true}`.

## Manual frontend Vercel deployment

1. Create another Vercel project.
2. Import the same repository.
3. Root Directory = `frontend`.
4. Framework = Vite.
5. Build Command = `npm run build`.
6. Output Directory = `dist`.
7. Add `VITE_API_URL=https://YOUR-BACKEND.vercel.app`.
8. Deploy.
9. Set backend `FRONTEND_URL` to the deployed frontend URL.
10. Redeploy backend.

## CORS troubleshooting
`FRONTEND_URL` is an allowlist. It must exactly match the frontend origin. Do not use wildcard CORS in production.

If `Failed to fetch`:
1. Open backend `/api/health`.
2. Verify it returns `{"ok":true}`.
3. Verify frontend `VITE_API_URL`.
4. Verify backend `FRONTEND_URL`.
5. Redeploy after environment-variable changes.

## Payment
COD, UPI and Card are UI selections. Orders start with `payment_status='pending'`. No fake payment success is generated. Add Razorpay/Stripe later with server-side signature/webhook verification before setting `paid`.

## Security
JWT contains id/email/role; protected routes derive the authenticated user from the verified token. Passwords use bcrypt. SQL is parameterized. Admin endpoints require JWT + admin role. Password hashes/secrets are never returned to the frontend.

## Scope note
The supplied API contract did not define wishlist endpoints, so the database table exists and the frontend has the authenticated wishlist route, but full wishlist CRUD requires adding `/api/wishlist` endpoints. All other requested core API families are implemented.
