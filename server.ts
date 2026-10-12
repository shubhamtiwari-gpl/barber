import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabase, saveDatabase } from './server/db.ts';
import { SERVICES, BARBERS, REVIEWS } from './server/data.ts';
import {
  generateToken,
  requireAdmin,
  verifyAdminCredentials,
  hashPassword,
  verifyPassword,
  generateUserToken,
  requireUserAuth,
} from './server/auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Initialize SQLite database
  const db = await getDatabase();

  // Public API Endpoints
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Crown & Blade Grooming Lounge API',
      database: 'SQLite (sql.js persistent)',
    });
  });

  app.get('/api/services', (_req: Request, res: Response) => {
    res.json(SERVICES);
  });

  app.get('/api/barbers', (_req: Request, res: Response) => {
    res.json(BARBERS);
  });

  app.get('/api/reviews', (_req: Request, res: Response) => {
    res.json(REVIEWS);
  });

  // Client Appointment Booking API
  app.post('/api/appointments', (req: Request, res: Response) => {
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
        notes,
      } = req.body;

      if (!customer_name || !email || !phone || !service_name || !barber_name || !date || !time) {
        return res.status(400).json({ error: 'Please provide all required appointment fields.' });
      }

      const id = `apt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const createdAt = new Date().toISOString();
      const price = Number(service_price) || 0;
      const status = 'confirmed';

      db.run(
        `INSERT INTO appointments (id, customer_name, email, phone, service_id, service_name, service_price, barber_id, barber_name, date, time, notes, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          String(customer_name).trim(),
          String(email).trim(),
          String(phone).trim(),
          String(service_id || 'custom'),
          String(service_name).trim(),
          price,
          String(barber_id || 'any'),
          String(barber_name).trim(),
          String(date).trim(),
          String(time).trim(),
          notes ? String(notes).trim() : '',
          status,
          createdAt,
        ]
      );

      saveDatabase();

      res.status(201).json({
        success: true,
        message: 'Your appointment has been reserved successfully.',
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
          created_at: createdAt,
        },
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({ error: 'Failed to save appointment. Please try again.' });
    }
  });

  // Client Contact Message API
  app.post('/api/contact', (req: Request, res: Response) => {
    try {
      const { name, email, phone, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Please provide all required contact fields.' });
      }

      const id = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const createdAt = new Date().toISOString();
      const status = 'unread';

      db.run(
        `INSERT INTO messages (id, name, email, phone, subject, message, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          String(name).trim(),
          String(email).trim(),
          phone ? String(phone).trim() : '',
          String(subject).trim(),
          String(message).trim(),
          status,
          createdAt,
        ]
      );

      saveDatabase();

      res.status(201).json({
        success: true,
        message: 'Your message has been delivered to Crown & Blade concierge.',
        id,
      });
    } catch (error) {
      console.error('Error saving contact message:', error);
      res.status(500).json({ error: 'Failed to send message. Please try again.' });
    }
  });

  // Helper to normalize phone numbers
  function normalizePhone(p: string): string {
    return p.replace(/[\s\-\(\)]/g, '').trim();
  }

  // Customer / User Authentication (Login or Auto-Register on first password entry)
  app.post('/api/user/auth', (req: Request, res: Response) => {
    try {
      const { phone, password, name } = req.body;

      if (!phone || !password) {
        return res.status(400).json({
          error: 'Mobile number aur password dono zaroori hain / Mobile number and password are required.',
        });
      }

      const cleanPhone = normalizePhone(String(phone));
      if (cleanPhone.length < 5) {
        return res.status(400).json({ error: 'Please enter a valid mobile number.' });
      }

      // Check if user exists in SQLite
      const stmt = db.prepare('SELECT * FROM users WHERE phone = ?');
      stmt.bind([cleanPhone]);
      let user: any = null;
      if (stmt.step()) {
        user = stmt.getAsObject();
      }
      stmt.free();

      // First time user: Save mobile and password
      if (!user) {
        const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const passHash = hashPassword(String(password));
        const userName = (name && String(name).trim()) || 'Valued Patron';
        const createdAt = new Date().toISOString();

        db.run(
          `INSERT INTO users (id, phone, password_hash, name, email, preferred_service, preferred_barber, created_at, last_login_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [userId, cleanPhone, passHash, userName, '', '', '', createdAt, createdAt]
        );
        saveDatabase();

        const token = generateUserToken(userId, cleanPhone);
        return res.status(201).json({
          success: true,
          isNewUser: true,
          message: 'खाता सफलतापूर्वक बन गया और लॉगिन हो गया! / Account created & logged in successfully!',
          token,
          user: {
            id: userId,
            phone: cleanPhone,
            name: userName,
            email: '',
            preferred_service: '',
            preferred_barber: '',
            created_at: createdAt,
          },
        });
      }

      // Existing user: Match password
      const isPasswordCorrect = verifyPassword(String(password), user.password_hash);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          error: 'गलत पासवर्ड! कृपया सही पासवर्ड डालें / Incorrect password. Please try again.',
        });
      }

      // Update last login
      const now = new Date().toISOString();
      db.run('UPDATE users SET last_login_at = ? WHERE id = ?', [now, user.id]);
      saveDatabase();

      const token = generateUserToken(user.id, user.phone);
      return res.json({
        success: true,
        isNewUser: false,
        message: 'सफलतापूर्वक लॉगिन हो गया / Login successful!',
        token,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          email: user.email,
          preferred_service: user.preferred_service,
          preferred_barber: user.preferred_barber,
          created_at: user.created_at,
        },
      });
    } catch (error) {
      console.error('Error during customer auth:', error);
      res.status(500).json({ error: 'Authentication failed. Please try again.' });
    }
  });

  // Customer Profile & Appointments
  app.get('/api/user/profile', requireUserAuth, (req: Request, res: Response) => {
    try {
      const authUser = (req as any).user;
      const stmt = db.prepare(
        'SELECT id, phone, name, email, preferred_service, preferred_barber, created_at, last_login_at FROM users WHERE id = ?'
      );
      stmt.bind([authUser.userId]);
      let profile: any = null;
      if (stmt.step()) {
        profile = stmt.getAsObject();
      }
      stmt.free();

      if (!profile) {
        return res.status(404).json({ error: 'User profile not found.' });
      }

      // Fetch user's booked appointments by phone
      const aptStmt = db.prepare(
        'SELECT * FROM appointments WHERE phone = ? OR phone LIKE ? ORDER BY date DESC, time DESC'
      );
      aptStmt.bind([profile.phone, `%${profile.phone.slice(-8)}%`]);
      const userAppointments: any[] = [];
      while (aptStmt.step()) {
        userAppointments.push(aptStmt.getAsObject());
      }
      aptStmt.free();

      res.json({
        user: profile,
        appointments: userAppointments,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  });

  // Update Customer Profile
  app.patch('/api/user/profile', requireUserAuth, (req: Request, res: Response) => {
    try {
      const authUser = (req as any).user;
      const { name, email, preferred_service, preferred_barber } = req.body;

      db.run(
        `UPDATE users SET
          name = COALESCE(?, name),
          email = COALESCE(?, email),
          preferred_service = COALESCE(?, preferred_service),
          preferred_barber = COALESCE(?, preferred_barber)
        WHERE id = ?`,
        [
          name !== undefined ? String(name).trim() : null,
          email !== undefined ? String(email).trim() : null,
          preferred_service !== undefined ? String(preferred_service).trim() : null,
          preferred_barber !== undefined ? String(preferred_barber).trim() : null,
          authUser.userId,
        ]
      );
      saveDatabase();

      const stmt = db.prepare(
        'SELECT id, phone, name, email, preferred_service, preferred_barber, created_at FROM users WHERE id = ?'
      );
      stmt.bind([authUser.userId]);
      stmt.step();
      const updatedUser = stmt.getAsObject();
      stmt.free();

      res.json({
        success: true,
        message: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई / Profile updated successfully.',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // Cancel Customer Appointment
  app.patch('/api/user/appointments/:id/cancel', requireUserAuth, (req: Request, res: Response) => {
    try {
      const authUser = (req as any).user;
      const { id } = req.params;

      // Verify appointment exists
      const aptStmt = db.prepare('SELECT * FROM appointments WHERE id = ?');
      aptStmt.bind([id]);
      let apt: any = null;
      if (aptStmt.step()) {
        apt = aptStmt.getAsObject();
      }
      aptStmt.free();

      if (!apt) {
        return res.status(404).json({ error: 'Appointment not found.' });
      }

      const cleanUserPhone = normalizePhone(authUser.phone);
      const cleanAptPhone = normalizePhone(apt.phone);
      if (!cleanAptPhone.includes(cleanUserPhone.slice(-8))) {
        return res.status(403).json({ error: 'Unauthorized to cancel this appointment.' });
      }

      db.run('UPDATE appointments SET status = ? WHERE id = ?', ['cancelled', id]);
      saveDatabase();

      res.json({ success: true, message: 'Appointment cancelled successfully.' });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      res.status(500).json({ error: 'Failed to cancel appointment.' });
    }
  });

  // Admin Authentication
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!verifyAdminCredentials(username, password)) {
      return res.status(401).json({ error: 'Invalid admin username or password.' });
    }

    const token = generateToken(username);
    res.json({
      success: true,
      token,
      admin: {
        username,
        name: 'Master Concierge Admin',
        role: 'admin',
      },
    });
  });

  // Admin: Get all appointments
  app.get('/api/admin/appointments', requireAdmin, (req: Request, res: Response) => {
    try {
      const statusFilter = req.query.status as string;
      let query = 'SELECT * FROM appointments ORDER BY date DESC, time DESC';
      let params: any[] = [];

      if (statusFilter && statusFilter !== 'all') {
        query = 'SELECT * FROM appointments WHERE status = ? ORDER BY date DESC, time DESC';
        params = [statusFilter];
      }

      const stmt = db.prepare(query);
      if (params.length > 0) {
        stmt.bind(params);
      }

      const appointments: any[] = [];
      while (stmt.step()) {
        const row = stmt.getAsObject();
        appointments.push(row);
      }
      stmt.free();

      res.json(appointments);
    } catch (error) {
      console.error('Error fetching admin appointments:', error);
      res.status(500).json({ error: 'Database query failed' });
    }
  });

  // Admin: Update appointment status
  app.patch('/api/admin/appointments/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be confirmed, completed, or cancelled.' });
      }

      db.run('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
      saveDatabase();

      res.json({ success: true, id, status });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      res.status(500).json({ error: 'Failed to update appointment' });
    }
  });

  // Admin: Delete appointment
  app.delete('/api/admin/appointments/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      db.run('DELETE FROM appointments WHERE id = ?', [id]);
      saveDatabase();
      res.json({ success: true, message: 'Appointment deleted successfully' });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      res.status(500).json({ error: 'Failed to delete appointment' });
    }
  });

  // Admin: Get all contact messages
  app.get('/api/admin/messages', requireAdmin, (_req: Request, res: Response) => {
    try {
      const stmt = db.prepare('SELECT * FROM messages ORDER BY created_at DESC');
      const messages: any[] = [];
      while (stmt.step()) {
        messages.push(stmt.getAsObject());
      }
      stmt.free();

      res.json(messages);
    } catch (error) {
      console.error('Error fetching admin messages:', error);
      res.status(500).json({ error: 'Database query failed' });
    }
  });

  // Admin: Update message status
  app.patch('/api/admin/messages/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['unread', 'replied', 'archived'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      db.run('UPDATE messages SET status = ? WHERE id = ?', [status, id]);
      saveDatabase();

      res.json({ success: true, id, status });
    } catch (error) {
      console.error('Error updating message status:', error);
      res.status(500).json({ error: 'Failed to update message' });
    }
  });

  // Admin: Delete message
  app.delete('/api/admin/messages/:id', requireAdmin, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      db.run('DELETE FROM messages WHERE id = ?', [id]);
      saveDatabase();
      res.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ error: 'Failed to delete message' });
    }
  });

  // Admin: Overview Dashboard Stats
  app.get('/api/admin/stats', requireAdmin, (_req: Request, res: Response) => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Today bookings
      const todayStmt = db.prepare('SELECT COUNT(*) as count FROM appointments WHERE date = ?');
      todayStmt.bind([today]);
      todayStmt.step();
      const todayBookings = Number(todayStmt.getAsObject().count || 0);
      todayStmt.free();

      // Total appointments
      const totalStmt = db.prepare('SELECT COUNT(*) as count, SUM(service_price) as revenue FROM appointments WHERE status != "cancelled"');
      totalStmt.step();
      const totalObj = totalStmt.getAsObject();
      const totalBookings = Number(totalObj.count || 0);
      const totalRevenue = Number(totalObj.revenue || 0);
      totalStmt.free();

      // Completed
      const completedStmt = db.prepare('SELECT COUNT(*) as count FROM appointments WHERE status = "completed"');
      completedStmt.step();
      const completedBookings = Number(completedStmt.getAsObject().count || 0);
      completedStmt.free();

      // Pending (Unread) Messages
      const msgStmt = db.prepare('SELECT COUNT(*) as count FROM messages WHERE status = "unread"');
      msgStmt.step();
      const pendingMessages = Number(msgStmt.getAsObject().count || 0);
      msgStmt.free();

      res.json({
        totalBookingsToday: todayBookings,
        totalBookings,
        pendingMessages,
        completedBookings,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error generating admin stats:', error);
      res.status(500).json({ error: 'Failed to calculate stats' });
    }
  });

  // Frontend Serving (Vite dev middleware vs Production static build)
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Crown & Blade] Full-stack server active on http://0.0.0.0:${PORT} (env: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server start error:', err);
  process.exit(1);
});
