import "dotenv/config"; //Permite que la aplicacion cargue las variables de entorno del .env
import env from "env-var";

//Acá se importan las variables de entorno
export const envs = {
  PORT: env.get("PORT").required().asPortNumber(),
  GEMINI_API_KEY: env.get("GEMINI_API_KEY").required().asString(),
  JWT_SEED: env.get("JWT_SEED").required().asString(),
  WHATSAPP_TWILIO_ACCOUNT_SID: env.get("WHATSAPP_TWILIO_ACCOUNT_SID").required().asString(),
  WHATSAPP_TWILIO_AUTH_TOKEN: env.get("WHATSAPP_TWILIO_AUTH_TOKEN").required().asString(),
};

//env-var necesita de dotenv/config para funcionar
