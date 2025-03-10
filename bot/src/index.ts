import { Bot, Context } from "grammy";
import type { BotCommand } from "grammy/types";
import dotenv from "dotenv";
import { fetchDolarData } from "./api";
import { initAnalytics, trackUser, trackCommand, generateReport, closeAnalytics } from "./analytics";

// Load environment variables
dotenv.config();

// Check if running in development mode
const isDevMode = process.env.DEV_MODE === 'true';

/**
 * Returns a formatted date string in Argentina timezone
 * @returns Formatted date string with Argentina timezone indicator
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

// Check if BOT_TOKEN is defined
if (!process.env.BOT_TOKEN) {
  console.error("BOT_TOKEN is not defined in .env file");
  process.exit(1);
}

// Create bot instance
const bot = new Bot(process.env.BOT_TOKEN);

// Define commands
const commands: BotCommand[] = [
  { command: "start", description: "Iniciar el bot" },
  { command: "help", description: "Mostrar ayuda" },
  { command: "dolaroficial", description: "Cotización dólar oficial" },
  { command: "dolarblue", description: "Cotización dólar blue" },
  { command: "dolarbolsa", description: "Cotización dólar bolsa" },
  { command: "dolarturista", description: "Cotización dólar turista" },
  { command: "mayorista", description: "Cotización dolar Mayorista" },
  { command: "all", description: "Todos los valores disponibles" },
  { command: "stats", description: "Estadísticas del bot (solo admin)" },
];

// Set bot commands
async function setupBot() {
  try {
    await bot.api.setMyCommands(commands);
    console.log("Bot commands set successfully");
  } catch (error) {
    console.error("Error setting bot commands:", error);
  }
}

// Middleware to track all interactions
bot.use(async (ctx, next) => {
  await trackUser(ctx);
  await next();
});

// Handle /start command
bot.command("start", async (ctx: Context) => {
  await trackCommand(ctx, "start");
  
  let welcomeMessage = "¡Bienvenido al Bot de API Dolar Argentina! 🇦🇷\n\n" +
    "Este bot te permite consultar las diferentes cotizaciones del dólar en Argentina.\n\n" +
    "Usa /help para ver los comandos disponibles.";
  
  // Add development mode indicator if in dev mode
  if (isDevMode && ctx.from && ctx.from.username === "bestulo") {
    welcomeMessage += "\n\n⚠️ *MODO DESARROLLO* ⚠️";
  }
  
  await ctx.reply(welcomeMessage, { parse_mode: "Markdown" });
});

// Handle /help command
bot.command("help", async (ctx: Context) => {
  await trackCommand(ctx, "help");
  const commandList = commands
    .filter(cmd => cmd.command !== "stats") // Hide stats command from regular users
    .map((cmd) => `/${cmd.command} - ${cmd.description}`)
    .join("\n");
  
  await ctx.reply(
    "Comandos disponibles:\n\n" +
    commandList
  );
});

// Handle dolar oficial command
bot.command("dolaroficial", async (ctx: Context) => {
  await trackCommand(ctx, "dolaroficial");
  try {
    const data = await fetchDolarData("/api/dolaroficial");
    await ctx.reply(
      `💵 *Dólar Oficial*\n\n` +
      `💰 Compra: $${data.compra}\n` +
      `💸 Venta: $${data.venta}\n` +
      `🕒 Actualizado: ${data.fecha}`,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    await ctx.reply("❌ Error al obtener la cotización del dólar oficial.");
    console.error("Error fetching dolar oficial:", error);
  }
});

// Handle dolar blue command
bot.command("dolarblue", async (ctx: Context) => {
  await trackCommand(ctx, "dolarblue");
  try {
    const data = await fetchDolarData("/api/dolarblue");
    await ctx.reply(
      `💵 *Dólar Blue*\n\n` +
      `💰 Compra: $${data.compra}\n` +
      `💸 Venta: $${data.venta}\n` +
      `🕒 Actualizado: ${data.fecha}`,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    await ctx.reply("❌ Error al obtener la cotización del dólar blue.");
    console.error("Error fetching dolar blue:", error);
  }
});

// Handle dolar bolsa command
bot.command("dolarbolsa", async (ctx: Context) => {
  await trackCommand(ctx, "dolarbolsa");
  try {
    const data = await fetchDolarData("/api/dolarbolsa");
    await ctx.reply(
      `💵 *Dólar Bolsa (MEP)*\n\n` +
      `💰 Compra: $${data.compra}\n` +
      `💸 Venta: $${data.venta}\n` +
      `🕒 Actualizado: ${data.fecha}`,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    await ctx.reply("❌ Error al obtener la cotización del dólar bolsa.");
    console.error("Error fetching dolar bolsa:", error);
  }
});

// Handle dolar turista command
bot.command("dolarturista", async (ctx: Context) => {
  await trackCommand(ctx, "dolarturista");
  try {
    const data = await fetchDolarData("/api/dolarturista");
    await ctx.reply(
      `💵 *Dólar Turista*\n\n` +
      `💰 Compra: $${data.compra}\n` +
      `💸 Venta: $${data.venta}\n` +
      `🕒 Actualizado: ${data.fecha}`,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    await ctx.reply("❌ Error al obtener la cotización del dólar turista.");
    console.error("Error fetching dolar turista:", error);
  }
});

// Handle mayorista command
bot.command("mayorista", async (ctx: Context) => {
  await trackCommand(ctx, "mayorista");
  try {
    const data = await fetchDolarData("/api/mayorista");
    await ctx.reply(
      `💵 *Dólar Mayorista*\n\n` +
      `💰 Compra: $${data.compra}\n` +
      `💸 Venta: $${data.venta}\n` +
      `🕒 Actualizado: ${data.fecha}`,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    await ctx.reply("❌ Error al obtener la cotización del dólar mayorista.");
    console.error("Error fetching dolar mayorista:", error);
  }
});

// Handle all command
bot.command("all", async (ctx: Context) => {
  await trackCommand(ctx, "all");
  try {
    const allData = await fetchDolarData("/api/all");
    
    // Check if allData and its properties exist
    if (!allData || !allData.valores || !allData.valores.Dolar) {
      throw new Error("Invalid data structure received from API");
    }
    
    const dolarData = allData.valores.Dolar;
    
    let message = "💵 *Cotizaciones de Dólar*\n\n";
    
    // Official Dollar
    if (dolarData.dolar && dolarData.dolar.compra && dolarData.dolar.venta) {
      message += `*Oficial*\n` +
        `Compra: $${dolarData.dolar.compra._text}\n` +
        `Venta: $${dolarData.dolar.venta._text}\n\n`;
    }
    
    // Blue Dollar
    if (dolarData.blue && dolarData.blue.compra && dolarData.blue.venta) {
      message += `*Blue*\n` +
        `Compra: $${dolarData.blue.compra._text}\n` +
        `Venta: $${dolarData.blue.venta._text}\n\n`;
    }
    
    // Bolsa Dollar
    if (dolarData.bolsa && dolarData.bolsa.compra && dolarData.bolsa.venta) {
      message += `*Bolsa (MEP)*\n` +
        `Compra: $${dolarData.bolsa.compra._text}\n` +
        `Venta: $${dolarData.bolsa.venta._text}\n\n`;
    }
    
    // Turista Dollar
    if (dolarData.turistaybolsa && dolarData.turistaybolsa.compra && dolarData.turistaybolsa.venta) {
      message += `*Turista*\n` +
        `Compra: $${dolarData.turistaybolsa.compra._text}\n` +
        `Venta: $${dolarData.turistaybolsa.venta._text}\n\n`;
    }
    
    // Mayorista Dollar
    if (dolarData.mayorista && dolarData.mayorista.compra && dolarData.mayorista.venta) {
      message += `*Mayorista*\n` +
        `Compra: $${dolarData.mayorista.compra._text}\n` +
        `Venta: $${dolarData.mayorista.venta._text}\n\n`;
    }
    
    // Bitcoin Dollar
    if (dolarData.dolarbitcoin && dolarData.dolarbitcoin.compra && dolarData.dolarbitcoin.venta) {
      message += `*Cripto*\n` +
        `Compra: $${dolarData.dolarbitcoin.compra._text}\n` +
        `Venta: $${dolarData.dolarbitcoin.venta._text}\n\n`;
    }
    
    message += `🕒 Actualizado: ${getArgentinaDateTime()}`;
    
    await ctx.reply(message, { parse_mode: "Markdown" });
  } catch (error) {
    await ctx.reply("❌ Error al obtener todas las cotizaciones.");
    console.error("Error fetching all data:", error);
  }
});

// Handle stats command (admin only)
bot.command("stats", async (ctx: Context) => {
  await trackCommand(ctx, "stats");
  // log message if dev mode
  if (isDevMode) {
    console.log({message: ctx.message, from: ctx.from})
  }
  // Only allow the admin (bestulo) to access stats
  if (ctx.from && ctx.from.username?.toLocaleLowerCase() === "bestulo") {
    
        
    const report = await generateReport();
    await ctx.reply(report, { parse_mode: "Markdown" });
  } else {
    await ctx.reply("⛔ No tienes permiso para acceder a esta información.");
  }
});

// Handle unknown commands
bot.on("message", async (ctx: Context) => {
  if (ctx.message && 'text' in ctx.message && ctx.message.text && ctx.message.text.startsWith("/")) {
    await ctx.reply(
      "Comando no reconocido. Usa /help para ver los comandos disponibles."
    );
  }
});

// Start the bot
async function startBot() {
  // Initialize analytics
  await initAnalytics();
  
  await setupBot();
  
  // Start the bot with long polling
  bot.start({
    onStart: (botInfo) => {
      if (isDevMode) {
        console.log(`🧪 DEVELOPMENT MODE 🧪`);
        console.log(`Bot @${botInfo.username} started in DEVELOPMENT mode!`);
      } else {
        console.log(`Bot @${botInfo.username} started successfully!`);
      }
    },
  });
  
  // Handle process termination
  process.on('SIGINT', async () => {
    console.log('Closing analytics database...');
    await closeAnalytics();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('Closing analytics database...');
    await closeAnalytics();
    process.exit(0);
  });
}

// Handle errors
bot.catch((err) => {
  console.error("Bot error:", err);
});

// Start the bot
startBot().catch(console.error); 