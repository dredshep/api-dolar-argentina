## Bot de Telegram para API Dolar Argentina

Este bot de Telegram permite consultar las diferentes cotizaciones del dólar en Argentina utilizando la API Dolar Argentina.

### Características

- Consulta de cotizaciones de diferentes tipos de dólar
- Comandos intuitivos para cada tipo de cotización
- Respuestas formateadas con información detallada
- Integración directa con la API (sin necesidad de servidor HTTP)

### Requisitos

- [Bun](https://bun.sh/) (v1.0.0 o superior)
- Token de bot de Telegram (obtenido a través de [@BotFather](https://t.me/BotFather))

### Instalación

1. Clona este repositorio o navega a la carpeta del bot si ya lo has clonado
2. Instala las dependencias:

```bash
cd bot
bun install
```

3. Crea un archivo `.env` en la carpeta `bot` con el siguiente contenido:

```
BOT_TOKEN=your_telegram_bot_token_here
```

4. Reemplaza `your_telegram_bot_token_here` con tu token de bot de Telegram.

### Cómo obtener un token de bot de Telegram

1. Abre Telegram y busca [@BotFather](https://t.me/BotFather)
2. Inicia una conversación y envía el comando `/newbot`
3. Sigue las instrucciones para crear un nuevo bot
4. Una vez creado, BotFather te proporcionará un token. Cópialo y úsalo en tu archivo `.env`

### Personalización del bot

Para personalizar tu bot, usa los siguientes comandos en BotFather:

- `/setname` - Establece el nombre: `Dólar Argentina Bot`
- `/setdescription` - Establece la descripción: `Bot oficial de API Dolar Argentina. Consulta las cotizaciones del dólar en Argentina en tiempo real. Usa /help para ver los comandos disponibles.`
- `/setabouttext` - Establece el texto "Acerca de": `Este bot te permite consultar las diferentes cotizaciones del dólar en Argentina en tiempo real. Desarrollado por el equipo de API Dolar Argentina. Visita nuestro repositorio en GitHub: https://github.com/Castrogiovanni20/api-dolar-argentina`
- `/setuserpic` - Establece la imagen de perfil (usa la sugerencia de imagen proporcionada en la sección "Avatar" más abajo)

### Uso

#### Modo desarrollo

Para ejecutar el bot en modo desarrollo:

```bash
cd bot
bun run src/index.ts
```

#### Modo producción

Para compilar y ejecutar el bot en modo producción:

```bash
cd bot
bun run build
bun run start
```

#### Despliegue con PM2

El bot incluye un archivo de configuración para [PM2](https://pm2.keymetrics.io/), que permite ejecutar el bot como un servicio:

1. Instala PM2 globalmente:

```bash
npm install -g pm2
```

2. Compila el bot:

```bash
cd bot
bun run build
```

3. Inicia el bot con PM2:

```bash
pm2 start ecosystem.config.js
```

4. Comandos útiles de PM2:

```bash
pm2 status                    # Ver estado del bot
pm2 logs dolar-argentina-bot  # Ver logs en tiempo real
pm2 restart dolar-argentina-bot # Reiniciar el bot
pm2 stop dolar-argentina-bot  # Detener el bot
pm2 delete dolar-argentina-bot # Eliminar el bot de PM2
```

### Comandos disponibles

- `/start` - Iniciar el bot
- `/help` - Mostrar ayuda
- `/dolaroficial` - Cotización dólar oficial
- `/dolarblue` - Cotización dólar blue
- `/dolarbolsa` - Cotización dólar bolsa (MEP)
- `/dolarturista` - Cotización dólar turista
- `/mayorista` - Cotización dólar mayorista
- `/all` - Todos los valores disponibles

### Estructura del proyecto

```
bot/
├── src/
│   ├── index.ts    # Archivo principal del bot
│   └── api.ts      # Módulo para interactuar con la API
├── dist/           # Código compilado
├── logs/           # Directorio para logs de PM2
├── .env            # Variables de entorno (solo token del bot)
├── package.json    # Dependencias y scripts
├── ecosystem.config.js # Configuración para PM2
└── README.md       # Este archivo
```

### Avatar

Sugerencia para generar una imagen de perfil para el bot usando DALL-E o Midjourney:

```
A professional logo for a financial bot called "Dólar Argentina Bot". The design features the Argentine flag colors (light blue and white) with a stylized dollar sign ($) in the center. The dollar sign should be gold/yellow and have a modern, clean look. The background should be a gradient of light blue to white, resembling the Argentine flag. The overall style should be minimalist and professional, suitable for a financial application. 4K, high detail, corporate style.
```

### Implementación técnica

Este bot utiliza una integración directa con la API Dolar Argentina, importando directamente los módulos necesarios en lugar de realizar peticiones HTTP. Esto permite que el bot funcione sin necesidad de tener un servidor HTTP en ejecución.

### Solución de problemas

- **Error 404 Not Found**: Asegúrate de que el token del bot en el archivo `.env` sea válido y esté correctamente configurado.
- **Error al obtener cotizaciones**: Verifica que los módulos de la API estén correctamente importados y que las rutas relativas sean correctas.

### Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Development Mode

For development purposes, you can use a separate development bot token. This helps to avoid conflicts with the production bot.

### Setup

1. Create a `.env.development` file in the bot directory
2. Add your development bot token:
   ```
   BOT_TOKEN=your_development_bot_token_here
   DEV_MODE=true
   ```

### Running in Development Mode

To run the bot in development mode:

```bash
bun run dev-token
```

When running in development mode:
- The console will display "DEVELOPMENT MODE" indicators
- The bot will show a development mode warning in the welcome message (only to the admin user)
- Analytics data will be stored separately from production data

This allows you to test new features without affecting the production bot. 