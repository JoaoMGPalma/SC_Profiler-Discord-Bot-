const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const cheerio = require('cheerio');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});


// Define slash commands
const commands = [
  
  new SlashCommandBuilder()
    .setName('profiler')
    .setDescription('Get RSI profile link')
    .addStringOption(option =>
      option.setName('username')
        .setDescription('RSI username')
        .setRequired(true)
    )
].map(command => command.toJSON());

// Register commands with Discord
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
(async () => {
  try {
    console.log('🚀 Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('✅ Slash commands registered!');
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
})();

// Bot ready
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('🏓 Pong, Joao!');
  }

  if (commandName === 'profiler') {
  const username = interaction.options.getString('username');

  const profileUrl = `https://robertsspaceindustries.com/en/citizens/${encodeURIComponent(username)}`;
  const orgsUrl = `${profileUrl}/organizations`;

  try {
    // Fetch profile page
    const response = await fetch(profileUrl);
    const html = await response.text();
    const $ = cheerio.load(html);

    const isValid = html.includes('CITIZEN DOSSIER') && html.includes('UEE Citizen Record');
    if (!isValid) {
      await interaction.reply(`❌ No profile found for "${username}".`);
      return;
    }

    // Fetch organizations page
    const orgResponse = await fetch(orgsUrl);
    const orgHtml = await orgResponse.text();
    const $$ = cheerio.load(orgHtml);

    // Parse Main Organization
    const mainBlock = $$('.box-content.org.main');
    const mainName = mainBlock.find('a.value').text().trim();
    const mainSID = mainBlock.find('strong.value').first().text().trim();
    const mainType = mainBlock.find('strong.value').eq(1).text().trim();
    const mainOrgUrl = `https://robertsspaceindustries.com/orgs/${mainSID}`;

    // Parse Affiliations
    const affiliations = [];
   $$('.box-content.org.affiliation').each((i, el) => {
  const raw = $$(el).html(); // DEBUG

  const affName = $$(el).find('a.value').text().trim();
  const affSID = $$(el).find('strong.value').first().text().trim();
  const affRank = $$(el).find('strong.value').eq(1).text().trim();
  const affUrl = `https://robertsspaceindustries.com/orgs/${affSID}`;

  if (affName && affSID) {
    affiliations.push(`🔹 ${affName} (${affSID}) — *${affRank}* <${affUrl}>`);
  }
});

    // Build reply message
    let reply = `🧑‍🚀 Citizen found: <${profileUrl}>\n🔗 Org page: <${orgsUrl}>\n\n🏢 **Main Organization:** ${mainName} (${mainSID}) — *${mainType}* <${mainOrgUrl}>\n`;

    if (affiliations.length > 0) {
      reply += `\n👥 **Affiliated Organizations:**\n${affiliations.join('\n')}`;
    } else {
      reply += `\n👥 No affiliated organizations found.`;
    }

    await interaction.reply({ content: reply, allowedMentions: { parse: [] } });

  } catch (error) {
    console.error(`Error checking profile for "${username}":`, error);
    await interaction.reply('⚠️ Something went wrong while checking the profile or affiliations.');
  }
}

  if (commandName === 'shutdown') {
    await interaction.reply('🛑 Shutting down… SCProfiler going offline.');
    process.exit(0);
  }
});

client.login(process.env.BOT_TOKEN);
