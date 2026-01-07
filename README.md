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

### Candidate APIs

#### Create a Candidate

* **Endpoint:** `POST /api/candidates`
* **Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "resumeUrl": "http://example.com/resume.pdf",
  "portfolioUrl": "http://portfolio.com",
  "githubUrl": "http://github.com/johndoe",
  "linkedinUrl": "http://linkedin.com/in/johndoe",
  "experience": 3,
  "expectedSalary": 50000,
  "noticePeriodDays": 30,
  "activelyLooking": true,
  "addressLine": "123 Street",
  "district": "City",
  "state": "State",
  "country": "Country",
  "jobtype": "FULL_TIME",
  "skills": ["React", "Node.js"],
  "industries": ["IT"],
  "roles": ["Full Stack Developer"]
}
```

* **Response:** Created candidate object

#### Get All Candidates

* **Endpoint:** `GET /api/candidates`
* **Response:** List of all candidates with skills, roles, industries

#### Get Candidate Matched Jobs

* **Endpoint:** `GET /api/candidates/:id/jobs`
* **Response:**

```json
{
  "candidate": { /* candidate info */ },
  "jobs": [ /* matched jobs */ ]
}
```

#### Get Candidate Recommended Jobs (Keyword-based)

* **Endpoint:** `GET /api/candidates/:id/recommended`
* **Response:**

```json
{
  "candidate": { /* candidate info */ },
  "matchedJobs": [ /* recommended jobs */ ]
}
```

---

### Job APIs

#### Create a Job

* **Endpoint:** `POST /api/jobs`
* **Body:**

```json
{
  "title": "Full Stack Developer",
  "companyName": "TechCorp",
  "description": "Job description here",
  "experienceMin": 2,
  "experienceMax": 5,
  "location": "Remote",
  "isRemote": true,
  "source": "WEWORKREMOTELY",
  "sourceJobId": "12345",
  "jobUrl": "https://weworkremotely.com/jobs/12345",
  "skills": ["React", "Node.js"],
  "industries": ["IT"]
}
```

* **Response:** Created job object

#### Get All Jobs

* **Endpoint:** `GET /api/jobs`
* **Response:** List of all jobs

#### Delete a Job

* **Endpoint:** `DELETE /api/jobs/:id`
* **Response:** Message confirming deletion

---

### Job Scraping API

#### Submit Job URL to Scrape

* **Endpoint:** `POST /api/submit-url`
* **Body:**

```json
{
  "url": "https://weworkremotely.com/remote-jobs/12345"
}
```

* **Response:** Scraped job details and stored in database

---

## Scraping Approach

* Axios fetches the HTML page, Cheerio parses it.
* Extracted fields include title, company, location, remote flag, description.
* Ethical scraping: limited scope, proper headers, no aggressive crawling.

---

## Matching Logic

* Rule-based, keyword matching using candidate's skills, roles, industries against job title, company, skills, industries.
* Returns jobs that match at least one keyword.

---

## Assumptions & Limitations

* Currently supports scraping from **WeWorkRemotely** only.
* Keyword-based matching; experience and location filters not fully applied.
* Job type and ranking can be enhanced.

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
