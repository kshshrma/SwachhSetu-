require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./config/db");
const verifyToken = require("./middleware/authMiddleware");
const isAdmin = require("./middleware/roleMiddleware");

const app = express();
const PORT = 5000;

/* ======================
   GLOBAL MIDDLEWARE
====================== */
app.use(express.json());

/* ======================
   ROOT TEST
====================== */
app.get("/", (req, res) => {
  res.send("SwachhSetu backend running 🚀");
});

/* ======================
   REGISTER
====================== */
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name,email,password) VALUES ($1,$2,$3)",
      [name, email, hash]
    );

    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   LOGIN
====================== */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (result.rows.length === 0)
    return res.status(401).json({ message: "Invalid credentials" });

  const user = result.rows[0];
  const ok = await bcrypt.compare(password, user.password);
  if (!ok)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    success: true,
    token,
    user: { id: user.id, name: user.name, role: user.role },
  });
});

/* ======================
   PROFILE
====================== */
app.get("/profile", verifyToken, (req, res) => {
  res.json(req.user);
});

/* ======================
   CREATE ISSUE (DUPLICATE + VALIDATION)
====================== */
app.post("/issues", verifyToken, async (req, res) => {
  try {
    const {
      title,
      description,
      issue_type,
      image_url,
      latitude,
      longitude,
    } = req.body;

    if (!issue_type || !image_url || latitude == null || longitude == null)
      return res.status(400).json({ message: "Missing required fields" });

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    )
      return res.status(400).json({ message: "Invalid coordinates" });

    const userId = req.user.id;

    const dup = await pool.query(
      `
      SELECT id FROM issues
      WHERE issue_type=$1 AND status!='resolved'
      AND (
        6371 * acos(
          cos(radians($2)) *
          cos(radians(latitude)) *
          cos(radians(longitude)-radians($3)) +
          sin(radians($2)) *
          sin(radians(latitude))
        )
      ) <= 0.05
      LIMIT 1
      `,
      [issue_type, latitude, longitude]
    );

    if (dup.rows.length > 0) {
      const issueId = dup.rows[0].id;

      await pool.query(
        `
        INSERT INTO issue_reports(issue_id,reported_by,image_url,latitude,longitude)
        VALUES ($1,$2,$3,$4,$5)
        ON CONFLICT DO NOTHING
        `,
        [issueId, userId, image_url, latitude, longitude]
      );

      await pool.query(
        "UPDATE issues SET report_count=report_count+1,is_grouped=true WHERE id=$1",
        [issueId]
      );

      return res.json({ success: true, grouped: true, issue_id: issueId });
    }

    const created = await pool.query(
      `
      INSERT INTO issues(title,description,issue_type,image_url,latitude,longitude,reported_by)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id
      `,
      [title, description, issue_type, image_url, latitude, longitude, userId]
    );

    const issueId = created.rows[0].id;

    await pool.query(
      `
      INSERT INTO issue_reports(issue_id,reported_by,image_url,latitude,longitude)
      VALUES ($1,$2,$3,$4,$5)
      `,
      [issueId, userId, image_url, latitude, longitude]
    );

    res.json({ success: true, grouped: false, issue_id: issueId });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   CITIZEN DASHBOARD
====================== */
app.get("/citizen/issues", verifyToken, async (req, res) => {
  const data = await pool.query(
    "SELECT * FROM issues WHERE reported_by=$1 ORDER BY created_at DESC",
    [req.user.id]
  );
  res.json(data.rows);
});

/* ======================
   ADMIN ISSUE QUEUE
====================== */
app.get("/admin/issues/queue", verifyToken, isAdmin, async (req, res) => {
  const status = req.query.status || "pending";
  const sort = req.query.sort === "oldest" ? "ASC" : "DESC";

  const data = await pool.query(
    `
    SELECT * FROM issues
    WHERE status=$1
    ORDER BY created_at ${sort}
    `,
    [status]
  );

  res.json(data.rows);
});

/* ======================
   ADMIN ASSIGN ISSUE + 🔔
====================== */
app.put("/admin/issues/:id/assign", verifyToken, isAdmin, async (req, res) => {
  await pool.query(
    "UPDATE issues SET assigned_to=$1 WHERE id=$2",
    [req.user.id, req.params.id]
  );

  await pool.query(
    `
    INSERT INTO notifications(user_id,title,message)
    VALUES ($1,$2,$3)
    `,
    [
      req.user.id,
      "Issue Assigned",
      `You are assigned issue #${req.params.id}`,
    ]
  );

  res.json({ success: true });
});

/* ======================
   ADMIN UPDATE STATUS + LOCK
====================== */
app.put("/admin/issues/:id/status", verifyToken, isAdmin, async (req, res) => {
  const allowed = ["pending", "in_progress"];
  if (!allowed.includes(req.body.status))
    return res.status(400).json({ message: "Invalid status" });

  const check = await pool.query(
    "SELECT status,reported_by FROM issues WHERE id=$1",
    [req.params.id]
  );

  if (check.rows[0].status === "resolved")
    return res.status(400).json({ message: "Issue already resolved" });

  await pool.query(
    `
    UPDATE issues
    SET status=$1,updated_at=CURRENT_TIMESTAMP
    WHERE id=$2 AND assigned_to=$3
    `,
    [req.body.status, req.params.id, req.user.id]
  );

  await pool.query(
    `
    INSERT INTO notifications(user_id,title,message)
    VALUES ($1,$2,$3)
    `,
    [
      check.rows[0].reported_by,
      "Issue Status Updated",
      `Issue #${req.params.id} is now ${req.body.status}`,
    ]
  );

  res.json({ success: true });
});

/* ======================
   ADMIN RESOLVE ISSUE + 🔔
====================== */
app.put("/admin/issues/:id/resolve", verifyToken, isAdmin, async (req, res) => {
  const { resolution_image_url, resolution_latitude, resolution_longitude } =
    req.body;

  const check = await pool.query(
    "SELECT status,reported_by FROM issues WHERE id=$1",
    [req.params.id]
  );

  if (check.rows[0].status === "resolved")
    return res.status(400).json({ message: "Already resolved" });

  await pool.query(
    `
    UPDATE issues
    SET status='resolved',
        resolution_image_url=$1,
        resolution_latitude=$2,
        resolution_longitude=$3,
        resolved_at=CURRENT_TIMESTAMP
    WHERE id=$4 AND assigned_to=$5
    `,
    [
      resolution_image_url,
      resolution_latitude,
      resolution_longitude,
      req.params.id,
      req.user.id,
    ]
  );

  await pool.query(
    `
    INSERT INTO notifications(user_id,title,message)
    VALUES ($1,$2,$3)
    `,
    [
      check.rows[0].reported_by,
      "Issue Resolved ✅",
      `Issue #${req.params.id} resolved with proof`,
    ]
  );

  res.json({ success: true });
});

/* ======================
   🔔 NOTIFICATIONS
====================== */
app.get("/notifications", verifyToken, async (req, res) => {
  const data = await pool.query(
    `
    SELECT id,title,message,is_read,created_at
    FROM notifications
    WHERE user_id=$1
    ORDER BY created_at DESC
    `,
    [req.user.id]
  );
  res.json(data.rows);
});

app.put("/notifications/:id/read", verifyToken, async (req, res) => {
  await pool.query(
    "UPDATE notifications SET is_read=true WHERE id=$1 AND user_id=$2",
    [req.params.id, req.user.id]
  );
  res.json({ success: true });
});

/* ======================
   START SERVER
====================== */
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});