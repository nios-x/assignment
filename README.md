# Job Preference Matching System

## Overview

This project implements a **Job Preference Matching System** where candidates can create profiles with preferences, jobs can be scraped from external platforms, and candidates are matched to jobs based on skills, roles, and industries.

It includes:

* Candidate Profile Management
* Job Data Management
* Job Scraping & Ingestion
* Preference-Based Job Matching
* Admin View for Matched Jobs

---

## Tech Stack

* **Backend:** Node.js, Express
* **Database:** PostgreSQL with Prisma ORM
* **Web Scraping:** Axios + Cheerio
* **Deployment:** Render / Railway / Heroku
* **Language:** TypeScript

---

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/job-preference-matching.git
cd job-preference-matching
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
PORT=3000
```

### 4. Run Prisma Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the Server

```bash
npm run dev
```

Server will run at `http://localhost:3000`.

---

## API Endpoints

### Candidates

* `POST /api/candidates` → Create a candidate
* `GET /api/candidates` → List all candidates
* `GET /api/candidates/:id/jobs` → View matched jobs
* `GET /api/candidates/:id/recommended` → View recommended jobs

### Jobs

* `POST /api/jobs` → Add a job manually
* `GET /api/jobs` → Get all jobs
* `DELETE /api/jobs/:id` → Delete a job

### Job Scraping

* `POST /api/submit-url` → Submit a job URL to scrape (currently supports **WeWorkRemotely**)

---

## Scraping Approach

* Scraping is implemented using **Axios** to fetch the page and **Cheerio** to parse HTML.
* Extracted fields:

  * Job title
  * Company name
  * Location
  * Remote option
  * Job description
* Ethical scraping is ensured: limited crawling, only specific pages, with proper headers.

---

## Matching Logic

* Each candidate has skills, roles, and preferred industries.
* Jobs have required skills and industries.
* Matching is **rule-based**:

  1. Collect candidate keywords: skills + roles + industries
  2. Compare with job keywords: job title + company + skills + industries
  3. Return jobs that match at least one keyword
* This ensures **explainable matches** without AI/ML.

---

## Assumptions & Limitations

* Currently supports scraping from **WeWorkRemotely** only. Other platforms can be added by implementing their parsing logic.
* Matching is **keyword-based**, no ranking by priority yet.
* Experience and location preferences are not fully considered in matching.
* Job type (Full-time/Contract) can be extended for better matching.

---

## Optional Enhancements (Future Work)

* Scoring jobs based on **skill overlap percentage**
* Filtering by **location, experience, or job type**
* Ranking recommended jobs
* Adding **frontend dashboard** for admin and candidate view

---

## Sample Output

### Candidate

```json
{
  "id": "c1f8...",
  "name": "John Doe",
  "skills": ["React", "Node.js"],
  "roles": ["Full Stack Developer"],
  "industries": ["IT"]
}
```

### Matched Jobs

```json
[
  {
    "title": "Full Stack Developer",
    "companyName": "TechCorp",
    "skills": ["React", "Node.js"],
    "industries": ["IT"],
    "jobUrl": "https://weworkremotely.com/jobs/123"
  }
]
```

---

## How to Contribute

* Fork the repo
* Add features or enhance scraping/matching logic
* Create a pull request
