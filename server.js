// server.ts
import express from "express";
import cors from "cors";
import path2 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";

// server/db.ts
import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var DB_FILE = path.resolve(process.cwd(), "barbershop.sqlite");
var dbInstance = null;
async function getDatabase() {
  if (dbInstance) {
    return dbInstance;
  }
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_FILE)) {
    try {
      const buffer = fs.readFileSync(DB_FILE);
      dbInstance = new SQL.Database(buffer);
    } catch (err) {
      console.error("Error loading existing sqlite db file, creating new one:", err);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }
  initTables(dbInstance);
  saveDatabase();
  return dbInstance;
}
function saveDatabase() {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error("Failed to persist SQLite database to disk:", err);
  }
}
function initTables(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      service_id TEXT NOT NULL,
      service_name TEXT NOT NULL,
      service_price REAL NOT NULL,
      barber_id TEXT NOT NULL,
      barber_name TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'confirmed',
      created_at TEXT NOT NULL
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      created_at TEXT NOT NULL
    );
  `);
  const countResult = db.exec("SELECT COUNT(*) as count FROM appointments");
  const appointmentCount = countResult.length > 0 && countResult[0].values.length > 0 ? Number(countResult[0].values[0][0]) : 0;
  if (appointmentCount === 0) {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 864e5).toISOString().split("T")[0];
    const seedAppointments = [
      {
        id: "apt-101",
        customer_name: "Alexander Sterling",
        email: "alex.sterling@example.com",
        phone: "+1 (555) 234-8901",
        service_id: "royal-treatment",
        service_name: "The Royal Treatment (Haircut + Beard Sculpt + Hot Towel)",
        service_price: 95,
        barber_id: "marcus-vance",
        barber_name: "Marcus Vance (Master Barber)",
        date: today,
        time: "11:00 AM",
        notes: "Espresso upon arrival please. Preparing for a keynote presentation.",
        status: "confirmed",
        created_at: new Date(Date.now() - 36e5 * 5).toISOString()
      },
      {
        id: "apt-102",
        customer_name: "Julian Montgomery",
        email: "julian.m@montgomery.co",
        phone: "+1 (555) 890-1234",
        service_id: "gentlemans-cut",
        service_name: "Gentleman's Signature Precision Cut",
        service_price: 55,
        barber_id: "elias-blackwood",
        barber_name: "Elias Blackwood (Senior Stylist)",
        date: today,
        time: "02:30 PM",
        notes: "Low skin fade with textured top.",
        status: "confirmed",
        created_at: new Date(Date.now() - 36e5 * 2).toISOString()
      },
      {
        id: "apt-103",
        customer_name: "David Harrington",
        email: "d.harrington@acme.org",
        phone: "+1 (555) 345-6789",
        service_id: "beard-sculpt",
        service_name: "Artisan Beard Sculpting & Razor Line",
        service_price: 45,
        barber_id: "dominic-cross",
        barber_name: "Dominic Cross (Beard Specialist)",
        date: today,
        time: "09:30 AM",
        notes: "Keep full length on chin, sharpen cheek lines.",
        status: "completed",
        created_at: new Date(Date.now() - 36e5 * 24).toISOString()
      },
      {
        id: "apt-104",
        customer_name: "Vincent Rossi",
        email: "vrossi@studiorossi.it",
        phone: "+1 (555) 901-2345",
        service_id: "royal-treatment",
        service_name: "The Royal Treatment (Haircut + Beard Sculpt + Hot Towel)",
        service_price: 95,
        barber_id: "marcus-vance",
        barber_name: "Marcus Vance (Master Barber)",
        date: tomorrow,
        time: "01:00 PM",
        notes: "First time visit recommended by Julian.",
        status: "confirmed",
        created_at: new Date(Date.now() - 36e5 * 8).toISOString()
      }
    ];
    for (const apt of seedAppointments) {
      db.run(
        `INSERT INTO appointments (id, customer_name, email, phone, service_id, service_name, service_price, barber_id, barber_name, date, time, notes, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [apt.id, apt.customer_name, apt.email, apt.phone, apt.service_id, apt.service_name, apt.service_price, apt.barber_id, apt.barber_name, apt.date, apt.time, apt.notes, apt.status, apt.created_at]
      );
    }
  }
  const msgCountRes = db.exec("SELECT COUNT(*) as count FROM messages");
  const msgCount = msgCountRes.length > 0 && msgCountRes[0].values.length > 0 ? Number(msgCountRes[0].values[0][0]) : 0;
  if (msgCount === 0) {
    const seedMessages = [
      {
        id: "msg-201",
        name: "Harrison Wells",
        email: "harrison.w@example.com",
        phone: "+1 (555) 432-1098",
        subject: "Private Grooming Lounge for Groomsmen Party",
        message: "Hello Crown & Blade team, I am getting married next month and would like to reserve the entire lounge for 6 groomsmen on Saturday morning. Do you offer private buyout packages with bourbon service?",
        status: "unread",
        created_at: new Date(Date.now() - 36e5 * 3).toISOString()
      },
      {
        id: "msg-202",
        name: "Edward King",
        email: "eking@vintagehorology.com",
        phone: "+1 (555) 765-4321",
        subject: "Custom Pomade & Beard Oil Restock Query",
        message: "Good afternoon, I purchased the Sandalwood & Cedar Beard Elixir last week and it is extraordinary. Do you ship retail bottles or can I order a 3-pack for pickup?",
        status: "unread",
        created_at: new Date(Date.now() - 36e5 * 12).toISOString()
      }
    ];
    for (const msg of seedMessages) {
      db.run(
        `INSERT INTO messages (id, name, email, phone, subject, message, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [msg.id, msg.name, msg.email, msg.phone, msg.subject, msg.message, msg.status, msg.created_at]
      );
    }
  }
}

// src/data/defaultData.ts
var SERVICES = [
  // Hair Category
  {
    id: "gentlemans-cut",
    name: "Gentleman's Signature Precision Cut",
    category: "hair",
    price: 55,
    durationMinutes: 45,
    description: "Bespoke consultation, precision shear or clipper work, straight-razor nape finish, hot steam towel, and artisanal botanical styling.",
    popular: true
  },
  {
    id: "classic-skin-fade",
    name: "Executive Skin Fade & Razor Finish",
    category: "hair",
    price: 60,
    durationMinutes: 50,
    description: "Seamless low, mid, or high fade down to the skin. Polished with foil shaver and razor neck detailing, topped with matte clay.",
    popular: true
  },
  {
    id: "scissor-sculpt",
    name: "Long Scissor Sculpt & Texture Work",
    category: "hair",
    price: 65,
    durationMinutes: 55,
    description: "Tailored for medium to long hairstyles. Hand-crafted shears sculpting, volume weight removal, and natural wave enhancement."
  },
  {
    id: "young-gentleman",
    name: "Young Gentleman's Cut (Under 14)",
    category: "hair",
    price: 40,
    durationMinutes: 35,
    description: "Clean, stylish haircut for younger gentlemen with age-appropriate styling product and complimentary soda or juice."
  },
  // Beard Category
  {
    id: "beard-sculpt",
    name: "Artisan Beard Sculpting & Razor Line",
    category: "beard",
    price: 45,
    durationMinutes: 35,
    description: "Custom beard architectural shaping, clipper contouring, straight-razor cheek and neckline polish, infused with warm jojoba & cedarwood oil.",
    popular: true
  },
  {
    id: "traditional-hot-shave",
    name: "Traditional Hot Lather Straight-Razor Shave",
    category: "beard",
    price: 50,
    durationMinutes: 45,
    description: "Triple hot eucalyptus towel preparation, badger brush badger-hair rich lather, Japanese steel straight razor shave, and cooling alum balm."
  },
  {
    id: "mustache-trim",
    name: "Mustache Contouring & Wax Styling",
    category: "beard",
    price: 25,
    durationMinutes: 20,
    description: "Precise shear trim, lip line definition, and styling with vintage amber beeswax."
  },
  // Royal Packages
  {
    id: "royal-treatment",
    name: "The Crown Royal Experience",
    category: "royal",
    price: 95,
    durationMinutes: 80,
    description: "Our flagship indulgence: Signature haircut, custom beard trim or hot lather shave, peppermint scalp massage, volcanic clay facial scrub, and complimentary aged bourbon.",
    popular: true
  },
  {
    id: "executive-lounge-package",
    name: "The Sovereign Groom & Scalp Detox",
    category: "royal",
    price: 120,
    durationMinutes: 90,
    description: "Full hair design, beard shaping, revitalizing tea tree scalp treatment, black obsidian eye mask, and ear/nose wax detailing."
  },
  // Treatments & Facial
  {
    id: "charcoal-facial",
    name: "Purifying Charcoal & Steam Facial",
    category: "treatments",
    price: 45,
    durationMinutes: 30,
    description: "Deep pore steam cleanse, activated charcoal mask, pore extraction, cold towel tone, and vitamin C hydration shield."
  },
  {
    id: "scalp-revival",
    name: "Rosemary & Peppermint Scalp Therapy",
    category: "treatments",
    price: 35,
    durationMinutes: 25,
    description: "Stimulating high-frequency scalp massage, organic rosemary botanical infusion, and hot moisture wrap to invigorate follicles."
  }
];
var BARBERS = [
  {
    id: "marcus-vance",
    name: "Marcus Vance",
    role: "Founder & Master Artisan",
    experienceYears: 16,
    rating: 5,
    reviewsCount: 382,
    specialty: "Master Scissor Craft & Royal Treatments",
    bio: "Trained in classic Savile Row barbershops and Milanese salons. Marcus brings 16 years of old-world refinement and razor discipline to every chair.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    availability: "Tue \u2013 Sat: 9:00 AM \u2013 6:30 PM"
  },
  {
    id: "elias-blackwood",
    name: "Elias Blackwood",
    role: "Senior Stylist & Fade Virtuoso",
    experienceYears: 10,
    rating: 4.9,
    reviewsCount: 294,
    specialty: "High Precision Fades & Modern Textures",
    bio: "Renowned for micro-precision skin fades and contemporary street-tailored geometry. Elias blends surgical clipper control with effortless style.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    availability: "Wed \u2013 Sun: 10:00 AM \u2013 7:30 PM"
  },
  {
    id: "dominic-cross",
    name: "Dominic Cross",
    role: "Beard Alchemist & Shave Master",
    experienceYears: 12,
    rating: 4.9,
    reviewsCount: 247,
    specialty: "Traditional Straight Razor & Beard Geometry",
    bio: "A passionate scholar of straight-edge shaving. Dominic cures ingrowns, shapes jawline-defining silhouettes, and creates bespoke oil blends.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    availability: "Mon \u2013 Fri: 9:30 AM \u2013 6:00 PM"
  },
  {
    id: "julian-solis",
    name: "Julian Solis",
    role: "Hair Artist & Scalp Specialist",
    experienceYears: 8,
    rating: 4.8,
    reviewsCount: 188,
    specialty: "Scissor Texturizing & Hair Health Therapies",
    bio: "Specialist in hair density preservation, therapeutic scalp detox, and natural directional wave cuts for modern gentlemen.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    availability: "Tue \u2013 Sat: 11:00 AM \u2013 8:00 PM"
  }
];
var REVIEWS = [
  {
    id: "rev-1",
    author: "Charles Beaumont",
    title: "The gold standard of grooming lounges",
    text: "Crown & Blade has completely redefined my expectations. The hot eucalyptus towel and razor finish from Marcus was perfection. Having an espresso and bespoke grooming in an ambiance this elevated is unparalleled.",
    rating: 5,
    service: "The Crown Royal Experience",
    barber: "Marcus Vance",
    date: "3 days ago"
  },
  {
    id: "rev-2",
    author: "Derek Sterling",
    title: "Flawless fade and crisp beard contour",
    text: "Elias is truly an artist. He studied my skull shape and hair grain before cutting. My skin fade has zero lines and the transition is seamless. Worth every single cent.",
    rating: 5,
    service: "Executive Skin Fade & Razor Finish",
    barber: "Elias Blackwood",
    date: "1 week ago"
  },
  {
    id: "rev-3",
    author: "Dr. Michael Chen",
    title: "The hot towel shave is pure therapy",
    text: "As a surgeon my weeks are intense. Coming in to see Dominic for the straight razor shave feels like an hour-long luxury vacation. The botanical oils smell magnificent and leave zero irritation.",
    rating: 5,
    service: "Traditional Hot Lather Straight-Razor Shave",
    barber: "Dominic Cross",
    date: "2 weeks ago"
  },
  {
    id: "rev-4",
    author: "Jameson Thorne",
    title: "The best barbershop in the city, period",
    text: "From the warm leather armchairs to the meticulous craft. The attention to detail is remarkable. You walk in as a guest and leave looking like royalty.",
    rating: 5,
    service: "Gentleman's Signature Precision Cut",
    barber: "Julian Solis",
    date: "3 weeks ago"
  }
];

// server/auth.ts
import crypto from "crypto";
var ADMIN_SECRET = process.env.ADMIN_SECRET || "crown-blade-secret-key-982347102934";
var DEFAULT_USERNAME = process.env.ADMIN_USERNAME || "admin";
var DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "crownblade2026";
function verifyAdminCredentials(username, password) {
  if (!username || !password) return false;
  return username.trim() === DEFAULT_USERNAME && password.trim() === DEFAULT_PASSWORD;
}
function generateToken(username) {
  const payload = {
    username,
    role: "admin",
    exp: Date.now() + 1e3 * 60 * 60 * 24 * 7
    // 7 days
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", ADMIN_SECRET).update(payloadB64).digest("base64url");
  return `${payloadB64}.${signature}`;
}
function verifyToken(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;
  const expectedSignature = crypto.createHmac("sha256", ADMIN_SECRET).update(payloadB64).digest("base64url");
  if (signature !== expectedSignature) return null;
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : req.headers["x-admin-token"];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired admin credentials" });
  }
  req.adminUser = decoded;
  next();
}

// server.ts
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path2.dirname(__filename2);
var isProd = process.env.NODE_ENV === "production";
var PORT = Number(process.env.PORT) || 3e3;
async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  const db = await getDatabase();
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      service: "Crown & Blade Grooming Lounge API",
      database: "SQLite (sql.js persistent)"
    });
  });
  app.get("/api/services", (_req, res) => {
    res.json(SERVICES);
  });
  app.get("/api/barbers", (_req, res) => {
    res.json(BARBERS);
  });
  app.get("/api/reviews", (_req, res) => {
    res.json(REVIEWS);
  });
  app.post("/api/appointments", (req, res) => {
    try {
      const {
        customer_name,
        email,
        phone,
        service_id,
        service_name,
        service_price,
        barber_id,
        barber_name,
        date,
        time,
        notes
      } = req.body;
      if (!customer_name || !email || !phone || !service_name || !barber_name || !date || !time) {
        return res.status(400).json({ error: "Please provide all required appointment fields." });
      }
      const id = `apt-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
      const createdAt = (/* @__PURE__ */ new Date()).toISOString();
      const price = Number(service_price) || 0;
      const status = "confirmed";
      db.run(
        `INSERT INTO appointments (id, customer_name, email, phone, service_id, service_name, service_price, barber_id, barber_name, date, time, notes, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          String(customer_name).trim(),
          String(email).trim(),
          String(phone).trim(),
          String(service_id || "custom"),
          String(service_name).trim(),
          price,
          String(barber_id || "any"),
          String(barber_name).trim(),
          String(date).trim(),
          String(time).trim(),
          notes ? String(notes).trim() : "",
          status,
          createdAt
        ]
      );
      saveDatabase();
      res.status(201).json({
        success: true,
        message: "Your appointment has been reserved successfully.",
        appointment: {
          id,
          customer_name,
          email,
          phone,
          service_name,
          service_price: price,
          barber_name,
          date,
          time,
          notes,
          status,
          created_at: createdAt
        }
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({ error: "Failed to save appointment. Please try again." });
    }
  });
  app.post("/api/contact", (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "Please provide all required contact fields." });
      }
      const id = `msg-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
      const createdAt = (/* @__PURE__ */ new Date()).toISOString();
      const status = "unread";
      db.run(
        `INSERT INTO messages (id, name, email, phone, subject, message, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          String(name).trim(),
          String(email).trim(),
          phone ? String(phone).trim() : "",
          String(subject).trim(),
          String(message).trim(),
          status,
          createdAt
        ]
      );
      saveDatabase();
      res.status(201).json({
        success: true,
        message: "Your message has been delivered to Crown & Blade concierge.",
        id
      });
    } catch (error) {
      console.error("Error saving contact message:", error);
      res.status(500).json({ error: "Failed to send message. Please try again." });
    }
  });
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (!verifyAdminCredentials(username, password)) {
      return res.status(401).json({ error: "Invalid admin username or password." });
    }
    const token = generateToken(username);
    res.json({
      success: true,
      token,
      admin: {
        username,
        name: "Master Concierge Admin",
        role: "admin"
      }
    });
  });
  app.get("/api/admin/appointments", requireAdmin, (req, res) => {
    try {
      const statusFilter = req.query.status;
      let query = "SELECT * FROM appointments ORDER BY date DESC, time DESC";
      let params = [];
      if (statusFilter && statusFilter !== "all") {
        query = "SELECT * FROM appointments WHERE status = ? ORDER BY date DESC, time DESC";
        params = [statusFilter];
      }
      const stmt = db.prepare(query);
      if (params.length > 0) {
        stmt.bind(params);
      }
      const appointments = [];
      while (stmt.step()) {
        const row = stmt.getAsObject();
        appointments.push(row);
      }
      stmt.free();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching admin appointments:", error);
      res.status(500).json({ error: "Database query failed" });
    }
  });
  app.patch("/api/admin/appointments/:id", requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!["confirmed", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Must be confirmed, completed, or cancelled." });
      }
      db.run("UPDATE appointments SET status = ? WHERE id = ?", [status, id]);
      saveDatabase();
      res.json({ success: true, id, status });
    } catch (error) {
      console.error("Error updating appointment status:", error);
      res.status(500).json({ error: "Failed to update appointment" });
    }
  });
  app.delete("/api/admin/appointments/:id", requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      db.run("DELETE FROM appointments WHERE id = ?", [id]);
      saveDatabase();
      res.json({ success: true, message: "Appointment deleted successfully" });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ error: "Failed to delete appointment" });
    }
  });
  app.get("/api/admin/messages", requireAdmin, (_req, res) => {
    try {
      const stmt = db.prepare("SELECT * FROM messages ORDER BY created_at DESC");
      const messages = [];
      while (stmt.step()) {
        messages.push(stmt.getAsObject());
      }
      stmt.free();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching admin messages:", error);
      res.status(500).json({ error: "Database query failed" });
    }
  });
  app.patch("/api/admin/messages/:id", requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!["unread", "replied", "archived"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      db.run("UPDATE messages SET status = ? WHERE id = ?", [status, id]);
      saveDatabase();
      res.json({ success: true, id, status });
    } catch (error) {
      console.error("Error updating message status:", error);
      res.status(500).json({ error: "Failed to update message" });
    }
  });
  app.delete("/api/admin/messages/:id", requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      db.run("DELETE FROM messages WHERE id = ?", [id]);
      saveDatabase();
      res.json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ error: "Failed to delete message" });
    }
  });
  app.get("/api/admin/stats", requireAdmin, (_req, res) => {
    try {
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const todayStmt = db.prepare("SELECT COUNT(*) as count FROM appointments WHERE date = ?");
      todayStmt.bind([today]);
      todayStmt.step();
      const todayBookings = Number(todayStmt.getAsObject().count || 0);
      todayStmt.free();
      const totalStmt = db.prepare('SELECT COUNT(*) as count, SUM(service_price) as revenue FROM appointments WHERE status != "cancelled"');
      totalStmt.step();
      const totalObj = totalStmt.getAsObject();
      const totalBookings = Number(totalObj.count || 0);
      const totalRevenue = Number(totalObj.revenue || 0);
      totalStmt.free();
      const completedStmt = db.prepare('SELECT COUNT(*) as count FROM appointments WHERE status = "completed"');
      completedStmt.step();
      const completedBookings = Number(completedStmt.getAsObject().count || 0);
      completedStmt.free();
      const msgStmt = db.prepare('SELECT COUNT(*) as count FROM messages WHERE status = "unread"');
      msgStmt.step();
      const pendingMessages = Number(msgStmt.getAsObject().count || 0);
      msgStmt.free();
      res.json({
        totalBookingsToday: todayBookings,
        totalBookings,
        pendingMessages,
        completedBookings,
        totalRevenue
      });
    } catch (error) {
      console.error("Error generating admin stats:", error);
      res.status(500).json({ error: "Failed to calculate stats" });
    }
  });
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== "true"
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path2.resolve(__dirname2, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path2.resolve(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Crown & Blade] Full-stack server active on http://0.0.0.0:${PORT} (env: ${isProd ? "production" : "development"})`);
  });
}
startServer().catch((err) => {
  console.error("Fatal server start error:", err);
  process.exit(1);
});
