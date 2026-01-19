# SC_Profiler - Discord-Bot

A simple Discord bot with automated web scraping to retrieve a player's profile and organization data. Built for use within the Star Citizen community.
SCProfiler is a Discord slash‑command bot built in Node.js that retrieves Star Citizen (RSI) profile and organization information by scraping public RSI citizen pages.  
It integrates Discord.js, Cheerio, and node-fetch to collect and format data directly inside Discord.

### Fetches:
- RSI profile link
- Main organization:
  - Name
  - SID
  - Rank
  - Link
- All affiliated organizations

- Validates whether the RSI profile exists
- Clean, formatted Discord responses
- Graceful error handling
- Command for controlled bot termination
- Uses environment variables for secure token handling

### This makes the project a practical example of:
- Web scraping
- DOM parsing
- API‑less data extraction
- Discord bot development

### 🛠️ Technologies Used
- Node.js  
- Discord.js v14  
- Cheerio (HTML scraping)  
- node-fetch  
- dotenv

 
Screenshot:

![SC_Profiler_Screenshot](https://github.com/user-attachments/assets/3b5246ee-65c5-4488-8a56-4d45e4b513cb)
