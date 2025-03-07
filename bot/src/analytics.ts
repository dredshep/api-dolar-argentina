import { Context } from "grammy";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";
import fs from "fs";

// Check if running in development mode
const isDevMode = process.env.DEV_MODE === 'true';

// Ensure logs directory exists
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Use different database file for development
const dbPath = path.join(logsDir, isDevMode ? "analytics.dev.db" : "analytics.db");

let db: Database | null = null;

/**
 * Initialize the analytics database
 */
export async function initAnalytics(): Promise<void> {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    if (isDevMode) {
      console.log(`Using development analytics database: ${dbPath}`);
    }

    // Create tables if they don't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        username TEXT,
        first_name TEXT,
        last_name TEXT,
        first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        message_count INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS groups (
        group_id TEXT PRIMARY KEY,
        title TEXT,
        first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        message_count INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS commands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        command TEXT,
        user_id TEXT,
        group_id TEXT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (group_id) REFERENCES groups(group_id)
      );

      CREATE TABLE IF NOT EXISTS daily_stats (
        date TEXT PRIMARY KEY,
        message_count INTEGER DEFAULT 0,
        user_count INTEGER DEFAULT 0,
        group_count INTEGER DEFAULT 0
      );
    `);

    console.log("Analytics database initialized");
  } catch (error) {
    console.error("Error initializing analytics database:", error);
  }
}

/**
 * Track a user interaction with the bot
 */
export async function trackUser(ctx: Context): Promise<void> {
  if (!db) return;
  
  try {
    // Only track if we have a from user
    if (!ctx.from) return;

    const userId = ctx.from.id.toString();
    const username = ctx.from.username || null;
    const firstName = ctx.from.first_name || null;
    const lastName = ctx.from.last_name || null;

    // Check if user exists
    const existingUser = await db.get("SELECT * FROM users WHERE user_id = ?", userId);

    if (existingUser) {
      // Update existing user
      await db.run(
        "UPDATE users SET username = ?, first_name = ?, last_name = ?, last_seen = CURRENT_TIMESTAMP, message_count = message_count + 1 WHERE user_id = ?",
        username, firstName, lastName, userId
      );
    } else {
      // Insert new user
      await db.run(
        "INSERT INTO users (user_id, username, first_name, last_name) VALUES (?, ?, ?, ?)",
        userId, username, firstName, lastName
      );
    }

    // Track group if this is a group message
    if (ctx.chat && ctx.chat.type !== 'private') {
      const groupId = ctx.chat.id.toString();
      const title = ctx.chat.title || 'Unknown Group';

      const existingGroup = await db.get("SELECT * FROM groups WHERE group_id = ?", groupId);

      if (existingGroup) {
        await db.run(
          "UPDATE groups SET title = ?, last_seen = CURRENT_TIMESTAMP, message_count = message_count + 1 WHERE group_id = ?",
          title, groupId
        );
      } else {
        await db.run(
          "INSERT INTO groups (group_id, title) VALUES (?, ?)",
          groupId, title
        );
      }
    }

    // Update daily stats
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const existingStats = await db.get("SELECT * FROM daily_stats WHERE date = ?", today);

    if (existingStats) {
      await db.run("UPDATE daily_stats SET message_count = message_count + 1 WHERE date = ?", today);
    } else {
      // Count unique users and groups for today
      const uniqueUsers = await db.get("SELECT COUNT(DISTINCT user_id) as count FROM users WHERE date(last_seen) = date(?)", today);
      const uniqueGroups = await db.get("SELECT COUNT(DISTINCT group_id) as count FROM groups WHERE date(last_seen) = date(?)", today);
      
      await db.run(
        "INSERT INTO daily_stats (date, message_count, user_count, group_count) VALUES (?, 1, ?, ?)",
        today, uniqueUsers?.count || 1, uniqueGroups?.count || 0
      );
    }
  } catch (error) {
    console.error("Error tracking user:", error);
  }
}

/**
 * Track a command execution
 */
export async function trackCommand(ctx: Context, command: string): Promise<void> {
  if (!db || !ctx.from) return;
  
  try {
    const userId = ctx.from.id.toString();
    const groupId = ctx.chat && ctx.chat.type !== 'private' ? ctx.chat.id.toString() : null;

    await db.run(
      "INSERT INTO commands (command, user_id, group_id) VALUES (?, ?, ?)",
      command, userId, groupId
    );
  } catch (error) {
    console.error("Error tracking command:", error);
  }
}

interface CommandStat {
  command: string;
  count: number;
}

interface DailyStat {
  date: string;
  message_count: number;
}

/**
 * Generate an analytics report
 */
export async function generateReport(): Promise<string> {
  if (!db) return "Analytics database not initialized";
  
  try {
    // Get user stats
    const totalUsers = await db.get("SELECT COUNT(*) as count FROM users");
    const activeUsers = await db.get("SELECT COUNT(*) as count FROM users WHERE datetime(last_seen) > datetime('now', '-7 day')");
    
    // Get group stats
    const totalGroups = await db.get("SELECT COUNT(*) as count FROM groups");
    const activeGroups = await db.get("SELECT COUNT(*) as count FROM groups WHERE datetime(last_seen) > datetime('now', '-7 day')");
    
    // Get message stats
    const totalMessages = await db.get("SELECT SUM(message_count) as count FROM users");
    
    // Get command stats
    const commandStats: CommandStat[] = await db.all("SELECT command, COUNT(*) as count FROM commands GROUP BY command ORDER BY count DESC LIMIT 5");
    
    // Get daily stats for the last 7 days
    const dailyStats: DailyStat[] = await db.all(`
      SELECT date, message_count 
      FROM daily_stats 
      WHERE date >= date('now', '-7 day') 
      ORDER BY date ASC
    `);

    // Format the report
    let report = "📊 *Bot Analytics Report*\n\n";
    
    report += "*User Stats:*\n";
    report += `- Total Users: ${totalUsers.count}\n`;
    report += `- Active Users (7d): ${activeUsers.count}\n\n`;
    
    report += "*Group Stats:*\n";
    report += `- Total Groups: ${totalGroups.count}\n`;
    report += `- Active Groups (7d): ${activeGroups.count}\n\n`;
    
    report += "*Message Stats:*\n";
    report += `- Total Messages: ${totalMessages.count || 0}\n\n`;
    
    report += "*Top Commands:*\n";
    commandStats.forEach(cmd => {
      report += `- /${cmd.command}: ${cmd.count} uses\n`;
    });
    
    report += "\n*Daily Messages (Last 7 Days):*\n";
    dailyStats.forEach(day => {
      report += `- ${day.date}: ${day.message_count} messages\n`;
    });
    
    report += `\n🕒 Generated: ${getArgentinaDateTime()}`;
    
    return report;
  } catch (error) {
    console.error("Error generating report:", error);
    return "Error generating analytics report";
  }
}

/**
 * Close the database connection
 */
export async function closeAnalytics(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}

/**
 * Returns a formatted date string in Argentina timezone
 */
function getArgentinaDateTime(): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  
  return new Date().toLocaleString('es-AR', options) + ' (ART)';
} 