import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { z } from 'zod';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from "@libsql/client";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// CORS configuration for production
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SIH Backend API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

let db;

async function initDb() {
  try {
    db = createClient({
      url: "libsql://sih-nikhil-rao20.aws-ap-south-1.turso.io",
      authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTc5OTYxOTMsImlkIjoiY2QyZWU2M2ItMjYwMS00NjY2LTk5ZjAtZmEwNjJlNzMxYzhjIiwicmlkIjoiYjU1NGE4MzUtZjg3Yi00MDEyLTk2MmItNTIxZGU1YWMxY2IyIn0.ImZEzi3NuRfRAqk79nG3GDSt7M8ITVBPzJ-0UGizQP4TC0qwE1ESlD2hFkO7ig03_yfUGYondE-RVy-2Z0VnAw",
    });

    console.log("📊 Database connection established");

    // All schema + pragma statements split into array
    const statements = [
      `PRAGMA foreign_keys = ON;`,

      `CREATE TABLE IF NOT EXISTS teams (
        team_id TEXT PRIMARY KEY,
        team_name TEXT NOT NULL,
        leader_name TEXT NOT NULL,
        leader_id TEXT NOT NULL,
        phone TEXT NOT NULL
      );`,

      `CREATE TABLE IF NOT EXISTS juries (
        jury_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        department TEXT NOT NULL,
        password_hash TEXT
      );`,

      `CREATE TABLE IF NOT EXISTS jury_assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_id TEXT NOT NULL,
        jury_id TEXT NOT NULL,
        UNIQUE(team_id, jury_id),
        FOREIGN KEY(team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
        FOREIGN KEY(jury_id) REFERENCES juries(jury_id) ON DELETE CASCADE
      );`,

      `CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_id TEXT NOT NULL,
        problem_id INTEGER NOT NULL,
        problem_code TEXT NOT NULL DEFAULT '',
        slides_link TEXT NOT NULL,
        created_at TEXT NOT NULL,
        presented INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY(team_id) REFERENCES teams(team_id)
      );`,

      `CREATE TABLE IF NOT EXISTS evaluations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_id TEXT NOT NULL,
        jury_id TEXT NOT NULL,
        ppt_design INTEGER NOT NULL,
        idea INTEGER NOT NULL,
        pitching INTEGER NOT NULL,
        project_impact INTEGER NOT NULL,
        remarks TEXT,
        total_score REAL NOT NULL,
        created_at TEXT NOT NULL,
        UNIQUE(team_id, jury_id)
      );`,

      `CREATE INDEX IF NOT EXISTS idx_juries_email ON juries(email);`,
      `CREATE INDEX IF NOT EXISTS idx_assignments_team ON jury_assignments(team_id);`,
      `CREATE INDEX IF NOT EXISTS idx_assignments_jury ON jury_assignments(jury_id);`,
      `CREATE INDEX IF NOT EXISTS idx_eval_team ON evaluations(team_id);`,
      `CREATE INDEX IF NOT EXISTS idx_eval_team_jury ON evaluations(team_id, jury_id);`,
      `CREATE INDEX IF NOT EXISTS idx_submissions_team ON submissions(team_id);`,
      `CREATE INDEX IF NOT EXISTS idx_submissions_created ON submissions(created_at);`,
    ];

    // Run statements one by one
    for (const stmt of statements) {
      await db.execute(stmt);
    }

    // ✅ Seeding
    await seedInitialData();

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

async function seedInitialData() {
  // Seed dummy juries if none exist
  const juryCount = await db.execute(`SELECT COUNT(*) as c FROM juries`);
  if (!juryCount || juryCount.c === 0) {
    const seed = [
      // Department juries
      ['CSE01','Dr. A CSE','cse01@rgukt.ac.in','CSE'],
      ['CSE02','Dr. B CSE','cse02@rgukt.ac.in','CSE'],
      ['CSE03','Dr. C CSE','cse03@rgukt.ac.in','CSE'],
      ['ECE01','Dr. A ECE','ece01@rgukt.ac.in','ECE'],
      ['ECE02','Dr. B ECE','ece02@rgukt.ac.in','ECE'],
      ['EEE01','Dr. A EEE','eee01@rgukt.ac.in','EEE'],
      ['EEE02','Dr. B EEE','eee02@rgukt.ac.in','EEE'],
      ['ME01','Dr. A ME','me01@rgukt.ac.in','Mechanical'],
      ['ME02','Dr. B ME','me02@rgukt.ac.in','Mechanical'],
      // Demo juries for login testing
      ['jury1','Demo Jury 1', 'jury1@sih2025.com', 'CSE'],
      ['jury2','Demo Jury 2', 'jury2@sih2025.com', 'ECE'],
      ['jury3','Demo Jury 3', 'jury3@sih2025.com', 'EEE'],
      ['jury4','Demo Jury 4', 'jury4@sih2025.com', 'Mechanical']
    ];
    
    const insertStmt = await db.execute(`INSERT INTO juries (jury_id, name, email, department) VALUES (?, ?, ?, ?)`);
    try {
      await db.execute('BEGIN');
      for (const row of seed) {
        await insertStmt.run(row);
      }
      await db.execute('COMMIT');
      console.log('🌱 Seeded initial jury data');
    } catch (e) {
      await db.execute('ROLLBACK');
      console.error('Failed to seed jury data:', e);
    } finally {
      await insertStmt.finalize();
    }
  }

  // Set default passwords for demo juries
  try {
    const demoPwds = [
      { email: 'jury1@sih2025.com', pass: 'jury1pass' },
      { email: 'jury2@sih2025.com', pass: 'jury2pass' },
      { email: 'jury3@sih2025.com', pass: 'jury3pass' },
      { email: 'jury4@sih2025.com', pass: 'jury4pass' }
    ];
    
    for (const { email, pass } of demoPwds) {
      const row = await db.execute(`SELECT jury_id, password_hash FROM juries WHERE email = ?`, [email]);
      if (row && (!row.password_hash || String(row.password_hash).trim() === '')) {
        const hashed = hashPassword(pass);
        await db.execute(`UPDATE juries SET password_hash = ? WHERE email = ?`, [hashed, email]);
      }
    }
    console.log('🔑 Demo jury passwords set');
  } catch (e) {
    console.error('Failed to set demo passwords:', e);
  }
}

// Password helpers (scrypt)
function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, 64);
  return `${salt.toString('hex')}:${derived.toString('hex')}`;
}

function verifyPassword(password, stored) {
  if (!stored) return false;
  const [saltHex, hashHex] = String(stored).split(':');
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, 'hex');
  const derived = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(Buffer.from(hashHex, 'hex'), derived);
}

function isAllowedProblemCode(code) {
  if (!/^SIH\d{5}$/.test(code)) return false;
  const num = Number(code.slice(3));
  if (num >= 25001 && num <= 25142) return true;
  return num === 12507 || num === 12508;
}

// Validation schemas
const submissionSchema = z.object({
  team_id: z.string().regex(/^\d{3}_SIH$/i, 'Team ID must match 001_SIH format'),
  team_name: z.string().min(2, 'Team name must be at least 2 characters'),
  leader_name: z.string().min(2, 'Leader name must be at least 2 characters'),
  leader_id: z.string().min(2, 'Leader ID must be at least 2 characters'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  problem_code: z.string().refine(isAllowedProblemCode, 'Invalid Problem Statement ID'),
  slides_link: z.string().url('Must be a valid URL')
});

const evaluationSchema = z.object({
  team_id: z.string().min(1),
  jury_id: z.string().min(1),
  ppt_design: z.number().int().min(1).max(10),
  idea: z.number().int().min(1).max(10),
  pitching: z.number().int().min(1).max(10),
  project_impact: z.number().int().min(1).max(10),
  remarks: z.string().optional()
});

const juryUpsertSchema = z.object({
  jury_id: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')).transform(v => v || null),
  department: z.string().min(2),
  password: z.string().min(4).optional().or(z.literal('')).transform(v => v || undefined)
});

// API Routes

// Get problem statements
app.get('/api/problems', async (req, res) => {
  try {
    const codes = [];
    for (let n = 25001; n <= 25142; n++) codes.push(`SIH${n}`);
    codes.push('SIH12507', 'SIH12508');
    const items = codes.map(code => ({ 
      code, 
      title: `Problem Statement ${code.slice(3)} - Innovation Challenge` 
    }));
    res.json(items);
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ error: 'Failed to fetch problem statements' });
  }
});

// Submit team registration
app.post('/api/submit', async (req, res) => {
  try {
    const parsed = submissionSchema.parse(req.body);

    // Upsert team
    await db.execute(
      `INSERT INTO teams (team_id, team_name, leader_name, leader_id, phone)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(team_id) DO UPDATE SET 
         team_name=excluded.team_name, 
         leader_name=excluded.leader_name, 
         leader_id=excluded.leader_id, 
         phone=excluded.phone`,
      [parsed.team_id, parsed.team_name, parsed.leader_name, parsed.leader_id, parsed.phone]
    );

    // Check submission limit (max 2 per team)
    const row = await db.execute(`SELECT COUNT(*) as count FROM submissions WHERE team_id = ?`, [parsed.team_id]);
    if (row.count >= 2) {
      return res.status(400).json({ 
        error: 'Submission limit reached. Only 2 problem statements allowed per team.' 
      });
    }

    const numericId = Number(parsed.problem_code.slice(3));
    await db.execute(
      `INSERT INTO submissions (team_id, problem_id, problem_code, slides_link, created_at)
       VALUES (?, ?, ?, ?, datetime('now'))`,
      [parsed.team_id, isFinite(numericId) ? numericId : 0, parsed.problem_code, parsed.slides_link]
    );

    // Auto-assign 2-3 juries randomly if none assigned yet
    const existingAssign = await db.execute(`SELECT 1 as x FROM jury_assignments WHERE team_id = ? LIMIT 1`, [parsed.team_id]);
    if (!existingAssign) {
      const juryList = await db.execute(`SELECT jury_id FROM juries ORDER BY RANDOM() LIMIT 3`);
      const pickCount = Math.max(2, Math.min(3, juryList.length));
      const picked = juryList.slice(0, pickCount).map(j => j.jury_id);
      
      const stmt = await db.execute(`INSERT INTO jury_assignments (team_id, jury_id) VALUES (?, ?) ON CONFLICT(team_id, jury_id) DO NOTHING`);
      try {
        await db.execute('BEGIN');
        for (const jid of picked) {
          await stmt.run([parsed.team_id, jid]);
        }
        await db.execute('COMMIT');
      } catch (e) {
        await db.execute('ROLLBACK');
      } finally {
        await stmt.finalize();
      }
    }

    res.json({
      success: true,
      message: `Successfully submitted presentation for Problem Statement ${parsed.problem_code}`,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ 
        error: err.errors.map(e => e.message).join(', ') 
      });
    }
    console.error('Submission error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get submissions for a team
app.get('/api/submissions/:team_id', async (req, res) => {
  try {
    const { team_id } = req.params;
    const submissions = await db.execute(
      `SELECT * FROM submissions WHERE team_id = ? ORDER BY created_at DESC`, 
      [team_id]
    );
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching team submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// List all submissions (admin)
app.get('/api/submissions', async (req, res) => {
  try {
    const { search = '', sort = 'problem_id', order = 'asc' } = req.query;
    const validSort = ['problem_id', 'created_at', 'team_id'];
    const sortBy = validSort.includes(String(sort)) ? String(sort) : 'problem_id';
    const sortOrder = String(order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    const like = `%${String(search)}%`;
    
    const rows = await db.execute(
      `SELECT s.id, s.team_id, t.team_name, t.leader_name, t.leader_id, t.phone, 
              s.problem_id, s.problem_code, s.slides_link, s.presented, s.created_at
       FROM submissions s
       JOIN teams t ON t.team_id = s.team_id
       WHERE s.team_id LIKE ? OR t.team_name LIKE ? OR s.problem_code LIKE ?
       ORDER BY ${sortBy} ${sortOrder}, s.created_at DESC`,
      [like, like, like]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Mark submission as presented
app.patch('/api/submissions/:id/presented', async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(`UPDATE submissions SET presented = 1 WHERE id = ?`, [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating presentation status:', error);
    res.status(500).json({ error: 'Failed to update presentation status' });
  }
});

// Delete submission
app.delete('/api/submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(`DELETE FROM submissions WHERE id = ?`, [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});

// Save jury evaluation
app.post('/api/evaluations', async (req, res) => {
  try {
    const e = evaluationSchema.parse(req.body);
    
    // Verify jury exists and is assigned to team
    const juryExists = await db.execute(`SELECT 1 FROM juries WHERE jury_id = ?`, [e.jury_id]);
    if (!juryExists) return res.status(403).json({ error: 'Unknown jury' });
    
    const assigned = await db.execute(
      `SELECT 1 FROM jury_assignments WHERE team_id = ? AND jury_id = ?`, 
      [e.team_id, e.jury_id]
    );
    if (!assigned) return res.status(403).json({ error: 'Jury not assigned to this team' });
    
    const total = (e.ppt_design + e.idea + e.pitching + e.project_impact) / 4;
    
    await db.execute(
      `INSERT INTO evaluations (team_id, jury_id, ppt_design, idea, pitching, project_impact, remarks, total_score, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(team_id, jury_id) DO UPDATE SET
         ppt_design=excluded.ppt_design,
         idea=excluded.idea,
         pitching=excluded.pitching,
         project_impact=excluded.project_impact,
         remarks=excluded.remarks,
         total_score=excluded.total_score,
         created_at=datetime('now')`,
      [e.team_id, e.jury_id, e.ppt_design, e.idea, e.pitching, e.project_impact, e.remarks || null, total]
    );

    // Auto-mark as presented if all assigned juries have evaluated
    const expectedRow = await db.execute(`SELECT COUNT(*) as c FROM jury_assignments WHERE team_id = ?`, [e.team_id]);
    const doneRow = await db.execute(
      `SELECT COUNT(*) as c FROM evaluations WHERE team_id = ? AND jury_id IN 
       (SELECT jury_id FROM jury_assignments WHERE team_id = ?)`, 
      [e.team_id, e.team_id]
    );
    
    if (expectedRow && doneRow && expectedRow.c > 0 && doneRow.c >= expectedRow.c) {
      await db.execute(`UPDATE submissions SET presented = 1 WHERE team_id = ?`, [e.team_id]);
    }
    
    res.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    console.error('Evaluation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin login and scores
const ADMIN_CREDENTIALS = { 
  username: process.env.ADMIN_EMAIL || 'admin', 
  password: process.env.ADMIN_PASSWORD || 'sih2025admin' 
};

app.post('/api/admin/scores', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const rows = await db.execute(
      `SELECT s.team_id, t.team_name, s.problem_id, s.problem_code,
              AVG(e.total_score) as avg_score,
              COUNT(e.id) as evaluations_count
       FROM submissions s
       JOIN teams t ON t.team_id = s.team_id
       LEFT JOIN evaluations e ON e.team_id = s.team_id
       GROUP BY s.team_id, s.problem_id
       ORDER BY avg_score DESC NULLS LAST`
    );
    
    const perJury = await db.execute(`SELECT team_id, jury_id, total_score FROM evaluations`);
    res.json({ summary: rows, perJury });
  } catch (error) {
    console.error('Error fetching admin scores:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

// Jury management
app.get('/api/admin/juries', async (req, res) => {
  try {
    const juries = await db.execute(
      `SELECT jury_id, name, email, department FROM juries ORDER BY department, name`
    );
    res.json(juries);
  } catch (e) {
    console.error('Error fetching juries:', e);
    res.status(500).json({ error: 'Failed to load juries' });
  }
});

app.post('/api/admin/juries', async (req, res) => {
  try {
    const j = juryUpsertSchema.parse(req.body);
    
    if (j.password) {
      const pwd = hashPassword(j.password);
      await db.execute(
        `INSERT INTO juries (jury_id, name, email, department, password_hash) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(jury_id) DO UPDATE SET 
           name=excluded.name, 
           email=excluded.email, 
           department=excluded.department, 
           password_hash=excluded.password_hash`,
        [j.jury_id, j.name, j.email, j.department, pwd]
      );
    } else {
      await db.execute(
        `INSERT INTO juries (jury_id, name, email, department) VALUES (?, ?, ?, ?)
         ON CONFLICT(jury_id) DO UPDATE SET 
           name=excluded.name, 
           email=excluded.email, 
           department=excluded.department`,
        [j.jury_id, j.name, j.email, j.department]
      );
    }
    res.json({ success: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.errors.map(x => x.message).join(', ') });
    }
    console.error('Error saving jury:', e);
    res.status(500).json({ error: 'Failed to save jury' });
  }
});

app.delete('/api/admin/juries/:jury_id', async (req, res) => {
  try {
    const { jury_id } = req.params;
    await db.execute(`DELETE FROM juries WHERE jury_id = ?`, [jury_id]);
    res.json({ success: true });
  } catch (e) {
    console.error('Error deleting jury:', e);
    res.status(500).json({ error: 'Failed to delete jury' });
  }
});

// Jury login
app.post('/api/jury/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const jury = await db.execute(
      `SELECT jury_id, name, email, department, password_hash FROM juries WHERE email = ?`, 
      [email]
    );
    
    if (!jury || !verifyPassword(password, jury.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ 
      jury_id: jury.jury_id, 
      name: jury.name, 
      department: jury.department 
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Jury assignments
app.get('/api/admin/assignments/:jury_id', async (req, res) => {
  try {
    const { jury_id } = req.params;
    const list = await db.execute(
      `SELECT team_id FROM jury_assignments WHERE jury_id = ? ORDER BY team_id`, 
      [jury_id]
    );
    res.json(list.map(r => r.team_id));
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

app.post('/api/admin/assignments/:jury_id', async (req, res) => {
  try {
    const { jury_id } = req.params;
    const { team_ids } = req.body || {};
    
    if (!Array.isArray(team_ids)) {
      return res.status(400).json({ error: 'team_ids array required' });
    }
    
    // Filter only existing team_ids
    const placeholders = team_ids.map(() => '?').join(',');
    const rows = await db.execute(
      `SELECT team_id FROM teams WHERE team_id IN (${placeholders})`, 
      team_ids.map(t => String(t))
    );
    const validIds = rows.map(r => r.team_id);
    
    await db.execute('BEGIN');
    await db.execute(`DELETE FROM jury_assignments WHERE jury_id = ?`, [jury_id]);
    
    const stmt = await db.execute(`INSERT INTO jury_assignments (team_id, jury_id) VALUES (?, ?)`);
    try {
      for (const tid of validIds) {
        await stmt.run([String(tid), jury_id]);
      }
      await db.execute('COMMIT');
    } catch (e) {
      await db.execute('ROLLBACK');
      throw e;
    } finally {
      await stmt.finalize();
    }
    
    const skipped = team_ids.filter(t => !validIds.includes(String(t)));
    res.json({ success: true, count: validIds.length, skipped });
  } catch (e) {
    console.error('Error saving assignments:', e);
    res.status(500).json({ error: 'Failed to save assignments' });
  }
});

// Import jury mapping from CSV
app.post('/api/admin/jury-mapping', async (req, res) => {
  try {
    const { csv } = req.body || {};
    if (!csv || typeof csv !== 'string') {
      return res.status(400).json({ error: 'CSV data required' });
    }

    const lines = csv.trim().split('\n');
    if (lines.length < 2) {
      return res.status(400).json({ error: 'CSV must have header and at least one data row' });
    }

    // Skip header line
    const dataLines = lines.slice(1);
    let successful = 0;
    let errors = [];

    await db.execute('BEGIN');
    
    try {
      for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i].trim();
        if (!line) continue;

        const parts = line.split(',').map(p => p.trim());
        if (parts.length < 2) {
          errors.push(`Line ${i + 2}: Invalid format, expected team_id,jury_id`);
          continue;
        }

        const [team_id, jury_id] = parts;
        
        // Check if team exists
        const teamExists = await db.execute(`SELECT 1 FROM teams WHERE team_id = ?`, [team_id]);
        if (!teamExists) {
          errors.push(`Line ${i + 2}: Team ${team_id} not found`);
          continue;
        }

        // Check if jury exists
        const juryExists = await db.execute(`SELECT 1 FROM juries WHERE jury_id = ?`, [jury_id]);
        if (!juryExists) {
          errors.push(`Line ${i + 2}: Jury ${jury_id} not found`);
          continue;
        }

        // Insert assignment (ignore duplicates)
        await db.execute(
          `INSERT INTO jury_assignments (team_id, jury_id) VALUES (?, ?) 
           ON CONFLICT(team_id, jury_id) DO NOTHING`,
          [team_id, jury_id]
        );
        successful++;
      }

      await db.execute('COMMIT');
      res.json({ 
        success: true, 
        message: `Successfully imported ${successful} assignments`,
        successful,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (e) {
      await db.execute('ROLLBACK');
      throw e;
    }
  } catch (e) {
    console.error('Error importing jury mapping:', e);
    res.status(500).json({ error: 'Failed to import jury mapping' });
  }
});

// Get assigned teams for jury
app.get('/api/jury/:jury_id/assigned-teams', async (req, res) => {
  try {
    const { jury_id } = req.params;
    
    const exists = await db.execute(`SELECT 1 FROM juries WHERE jury_id = ?`, [jury_id]);
    if (!exists) return res.status(404).json({ error: 'Jury not found' });
    
    const rows = await db.execute(
      `SELECT DISTINCT s.team_id, t.team_name, t.leader_name, t.leader_id, s.slides_link,
              COALESCE((SELECT 1 FROM evaluations e WHERE e.team_id = s.team_id AND e.jury_id = ?), 0) as evaluated,
              s.problem_id, s.problem_code,
              COALESCE((SELECT AVG(e2.total_score) FROM evaluations e2 WHERE e2.team_id = s.team_id), NULL) as avg_score
       FROM submissions s
       JOIN teams t ON t.team_id = s.team_id
       JOIN jury_assignments ja ON ja.team_id = s.team_id
       WHERE ja.jury_id = ?
       ORDER BY s.created_at DESC`,
      [jury_id, jury_id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching assigned teams:', error);
    res.status(500).json({ error: 'Failed to fetch assigned teams' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Unexpected server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
async function startServer() {
  try {
    await initDb();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
