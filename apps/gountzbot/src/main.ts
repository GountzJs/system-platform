import { twitchBotUsername } from './core/settings';
import { handlerOnMessage, handlerOnProcess } from './handlers';
import { TmiClient } from './lib/twitch-client';

async function bootstrap() {
  const client = new TmiClient();
  await client.connect().then(() => console.log('🚀 Conectado a Twitch.'));
  handlerOnProcess(client);
  handlerOnMessage(client);
  client.say(`#${twitchBotUsername}`, '!message success-🤖 Bot inicializado.');
}

bootstrap()
  .then(() => console.log('🤖 Bot iniciado con éxito'))
  .catch((err) => console.error('❌ Error al iniciar el bot: ', err));
