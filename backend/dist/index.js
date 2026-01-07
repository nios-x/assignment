"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const route_1 = __importDefault(require("./api/candidate/route"));
const route_2 = __importDefault(require("./api/jobrole/route"));
const route_3 = __importDefault(require("./api/crawler/route"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const PATH = path_1.default.join(__dirname.split("\\").filter(e => e != "src").join("\\"), "dist");
// Serve static frontend files
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(PATH));
app.use("/api/candidates", route_1.default);
app.use("/api/jobs", route_2.default);
app.use("/api/submit-url", route_3.default);
app.get(/.*/, (req, res) => {
    res.sendFile(path_1.default.join(PATH, "index.html"));
});
app.listen(PORT, () => {
    console.log(`Cnear Assignment: Server is running at port: ${PORT}`);
});
