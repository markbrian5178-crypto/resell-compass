# 📄 THE RESELLER'S COMPASS: FULL TECHNICAL SPECIFICATION

This document outlines the complete plan for building a single-user eBay business management application, "The Reseller's Compass."

## [1. ARCHITECTURE & GUIDELINES]

* **Goal:** Build a secure, free-to-use, scalable web application.
* **Target Stack:** **TypeScript** (for type safety), **React** (Vite or Next.js for client), **Node.js/Express** (for server API), **Tailwind CSS** (for styling).
* **Hosting:** Structure code for easy deployment to free-tier services (Vercel/Render for client, Supabase/Render for DB/Server).
* **Structure:** Separate the codebase into `client/` and `server/` directories.

---

## [2. DATA SCHEMA & AUTHENTICATION (PostgreSQL/Prisma)]

* Use **Prisma** as the ORM to manage the PostgreSQL schema.
* **Authentication:** Implement secure user **Login/Signup** using **Bcrypt** for password hashing and **JWT** for session management.
* **Core Tables:**
    * `User`: (id, email, password_hash)
    * `InventoryItem`: (id, user_id, name, status, cogs, sale_price, net_profit, r2_image_url)
        * `status` must be an ENUM: 'Sourced', 'InProcessing', 'Drafting', 'Active', 'Sold'.
    * `Expense`: (id, user_id, type, amount, date, is_deductible)
        * `type` must be an ENUM: 'COGS', 'Mileage', 'Supplies', 'Fee'.

---

## [3. FEATURE 1: INVENTORY MANAGEMENT (KANBAN)]

* **Page:** `/inventory`
* **Component:** Build an interactive **Kanban Board** 

[Image of Kanban board inventory management]
 displaying items grouped by their `status`.
* **Functionality:** Implement **drag-and-drop** to update an item's status via the API.
* **API:** Create **CRUD** (Create, Read, Update, Delete) endpoints on the server for the `InventoryItem` model.

---

## [4. FEATURE 2: DRAFT WORKSHOP (AI & R2)]

* **Page:** `/draft-workshop`
* **Photo Uploader:** Implement a multi-file drag-and-drop upload component.
* **Image Storage (CRITICAL R2 INTEGRATION):**
    * The backend must use the **AWS SDK (S3 Client)** to generate a short-lived **Presigned PUT URL** for **Cloudflare R2**.
    * The frontend must use this Presigned URL for a direct client-to-R2 upload (bypassing the Node.js server).
    * Upon success, the backend saves only the resulting **Public URL** into `InventoryItem.r2_image_url`.
* **Profit Calculator:** Implement a sticky widget calculating `Net Profit` in real-time.
    * **Formula:** `Net Profit = Sale Price - COGS - (Sale Price * 0.13) - Shipping Cost` (Use 13% for the eBay fee rate placeholder).
* **AI SEO Generator:** Create a server endpoint (`/api/ai/generate-seo`) using the **Gemini API** key (from `.env`). This returns **three optimized eBay title suggestions** and a **detailed product description draft** based on item keywords.

---

## [5. FEATURE 3: FINANCE HUB & REPORTING]

* **Page:** `/finance`
* **Expense Entry:** Create a simple form for entering `Expense` records, clearly setting the `is_deductible` flag.
* **P&L Calculation:** Display the total **Net Profit YTD** (Revenue - COGS - Deductible Operating Expenses).
* **Tax Estimate:** Show a **Tax Liability Estimate** based on a customizable assumed Federal tax rate (e.g., 25%) applied to the Net Profit.
