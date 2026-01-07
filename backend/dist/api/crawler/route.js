"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const db_1 = require("../../utils/db");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ message: "URL required" });
        }
        const response = await axios_1.default.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
                "Accept-Language": "en-US,en;q=0.9",
            },
        });
        const html = response.data;
        const $ = cheerio.load(html);
        const title = $("h1.lis-container__header__hero__company-info__title").text().trim();
        const location = $(".box--region").first().text().trim() || "Remote";
        const isRemote = location.toLowerCase().includes("anywhere");
        const jobTypeText = $(".box--jobType").text().toLowerCase();
        const jobType = jobTypeText.includes("contract") ? "CONTRACT" : "FULL_TIME";
        const description = $(".lis-container__job__sidebar__job-about")
            .text()
            .replace(/\s+/g, " ")
            .trim();
        const source = "WEWORKREMOTELY";
        const sourceJobId = url.split("/").pop();
        const companyName = sourceJobId.split("-")[0].toUpperCase();
        const job = await db_1.prisma.job.upsert({
            where: {
                source_sourceJobId: {
                    source,
                    sourceJobId,
                },
            },
            update: {},
            create: {
                title,
                companyName,
                description,
                location,
                isRemote,
                source,
                sourceJobId,
                jobUrl: url,
            },
        });
        res.status(200).json({
            message: "Job crawled & stored",
            job,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to crawl job" });
    }
});
exports.default = router;
