import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.resolve(process.cwd(), 'barbershop.sqlite');

let dbInstance: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    try {
      const buffer = fs.readFileSync(DB_FILE);
      dbInstance = new SQL.Database(buffer);
    } catch (err) {
      console.error('Error loading existing sqlite db file, creating new one:', err);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }

  initTables(dbInstance);
  saveDatabase();
  return dbInstance;
}

export function saveDatabase(): void {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Failed to persist SQLite database to disk:', err);
  }
}

function initTables(db: Database) {
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

  // Check if we should seed sample initial data for rich demonstration
  const countResult = db.exec("SELECT COUNT(*) as count FROM appointments");
  const appointmentCount = countResult.length > 0 && countResult[0].values.length > 0 ? Number(countResult[0].values[0][0]) : 0;

  if (appointmentCount === 0) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const seedAppointments = [
      {
        id: 'apt-101',
        customer_name: 'Alexander Sterling',
        email: 'alex.sterling@example.com',
        phone: '+1 (555) 234-8901',
        service_id: 'royal-treatment',
        service_name: 'The Royal Treatment (Haircut + Beard Sculpt + Hot Towel)',
        service_price: 95.0,
        barber_id: 'marcus-vance',
        barber_name: 'Marcus Vance (Master Barber)',
        date: today,
        time: '11:00 AM',
        notes: 'Espresso upon arrival please. Preparing for a keynote presentation.',
        status: 'confirmed',
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'apt-102',
        customer_name: 'Julian Montgomery',
        email: 'julian.m@montgomery.co',
        phone: '+1 (555) 890-1234',
        service_id: 'gentlemans-cut',
        service_name: "Gentleman's Signature Precision Cut",
        service_price: 55.0,
        barber_id: 'elias-blackwood',
        barber_name: 'Elias Blackwood (Senior Stylist)',
        date: today,
        time: '02:30 PM',
        notes: 'Low skin fade with textured top.',
        status: 'confirmed',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'apt-103',
        customer_name: 'David Harrington',
        email: 'd.harrington@acme.org',
        phone: '+1 (555) 345-6789',
        service_id: 'beard-sculpt',
        service_name: 'Artisan Beard Sculpting & Razor Line',
        service_price: 45.0,
        barber_id: 'dominic-cross',
        barber_name: 'Dominic Cross (Beard Specialist)',
        date: today,
        time: '09:30 AM',
        notes: 'Keep full length on chin, sharpen cheek lines.',
        status: 'completed',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'apt-104',
        customer_name: 'Vincent Rossi',
        email: 'vrossi@studiorossi.it',
        phone: '+1 (555) 901-2345',
        service_id: 'royal-treatment',
        service_name: 'The Royal Treatment (Haircut + Beard Sculpt + Hot Towel)',
        service_price: 95.0,
        barber_id: 'marcus-vance',
        barber_name: 'Marcus Vance (Master Barber)',
        date: tomorrow,
        time: '01:00 PM',
        notes: 'First time visit recommended by Julian.',
        status: 'confirmed',
        created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
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
        id: 'msg-201',
        name: 'Harrison Wells',
        email: 'harrison.w@example.com',
        phone: '+1 (555) 432-1098',
        subject: 'Private Grooming Lounge for Groomsmen Party',
        message: 'Hello Crown & Blade team, I am getting married next month and would like to reserve the entire lounge for 6 groomsmen on Saturday morning. Do you offer private buyout packages with bourbon service?',
        status: 'unread',
        created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 'msg-202',
        name: 'Edward King',
        email: 'eking@vintagehorology.com',
        phone: '+1 (555) 765-4321',
        subject: 'Custom Pomade & Beard Oil Restock Query',
        message: 'Good afternoon, I purchased the Sandalwood & Cedar Beard Elixir last week and it is extraordinary. Do you ship retail bottles or can I order a 3-pack for pickup?',
        status: 'unread',
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
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
