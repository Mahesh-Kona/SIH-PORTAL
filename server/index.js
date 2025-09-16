import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://royalkona4_db_user:sih1234@cluster0.a0ik5zj.mongodb.net/sihdb?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// =======================
// SCHEMAS
// =======================
const teamSchema = new mongoose.Schema({
  team_id: { type: String, unique: true },
  team_name: String,
  leader_name: String,
  leader_id: String,
  phone: String,
});

const jurySchema = new mongoose.Schema({
  jury_id: { type: String, unique: true },
  name: String,
  email: { type: String, unique: true, sparse: true },
  department: String,
  password_hash: String,
});

const submissionSchema = new mongoose.Schema({
  team_id: String,
  problem_id: Number,
  problem_code: String,
  slides_link: String,
  created_at: { type: Date, default: Date.now },
  presented: { type: Boolean, default: false },
});

const evaluationSchema = new mongoose.Schema({
  team_id: String,
  jury_id: String,
  ppt_design: Number,
  idea: Number,
  pitching: Number,
  project_impact: Number,
  remarks: String,
  total_score: Number,
  created_at: { type: Date, default: Date.now },
});

const assignmentSchema = new mongoose.Schema({
  team_id: String,
  jury_id: String,
});

// =======================
// MODELS
// =======================
const Team = mongoose.model("Team", teamSchema);
const Jury = mongoose.model("Jury", jurySchema);
const Submission = mongoose.model("Submission", submissionSchema);
const Evaluation = mongoose.model("Evaluation", evaluationSchema);
const Assignment = mongoose.model("Assignment", assignmentSchema);

// =======================
// PASSWORD HELPERS
// =======================
function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}
function verifyPassword(password, stored) {
  if (!stored) return false;
  const [saltHex, hashHex] = String(stored).split(":");
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const derived = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(Buffer.from(hashHex, "hex"), derived);
}

// =======================
// ROUTES
// =======================

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Submit a team
app.post("/api/submit", async (req, res) => {
  try {
    const submissionSchema = z.object({
      team_id: z.string(),
      team_name: z.string(),
      leader_name: z.string(),
      leader_id: z.string(),
      phone: z.string().regex(/^[0-9]{10}$/),
      problem_code: z.string(),
      slides_link: z.string().url(),
    });

    const parsed = submissionSchema.parse(req.body);

    // Upsert team
    await Team.updateOne(
      { team_id: parsed.team_id },
      {
        team_name: parsed.team_name,
        leader_name: parsed.leader_name,
        leader_id: parsed.leader_id,
        phone: parsed.phone,
      },
      { upsert: true }
    );

    // Count submissions
    const count = await Submission.countDocuments({ team_id: parsed.team_id });
    if (count >= 2) {
      return res
        .status(400)
        .json({ error: "Submission limit reached. Only 2 allowed per team." });
    }

    const numericId = Number(parsed.problem_code.slice(3)) || 0;
    const submission = await Submission.create({
      team_id: parsed.team_id,
      problem_id: numericId,
      problem_code: parsed.problem_code,
      slides_link: parsed.slides_link,
    });

    res.json(submission);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Jury login
app.post("/api/jury/login", async (req, res) => {
  const { email, password } = req.body || {};
  const jury = await Jury.findOne({ email });
  if (!jury || !verifyPassword(password, jury.password_hash)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  res.json({
    jury_id: jury.jury_id,
    name: jury.name,
    department: jury.department,
  });
});

// GET all submissions
app.get("/api/submissions", async (req, res) => {
  try {
    const { search, sort, order } = req.query;

    let query: any = {};
    if (search) query.team_id = { $regex: String(search), $options: "i" };

    let submissions = await Submission.find(query).lean();

    if (sort && order) {
      const dir = order === "asc" ? 1 : -1;
      submissions = submissions.sort((a, b) => (a[sort as string] > b[sort as string] ? dir : -dir));
    }

    res.json(submissions);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH mark submission as presented
app.patch("/api/submissions/:id/presented", async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findByIdAndUpdate(id, { presented: true }, { new: true });
    res.json(submission);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE a submission
app.delete("/api/submissions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Submission.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// =======================
// SERVER START
// =======================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API running on http://0.0.0.0:${PORT}`);
});
