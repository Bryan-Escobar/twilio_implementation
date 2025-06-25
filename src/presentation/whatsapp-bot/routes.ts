import { Router } from "express";

import { WhatsController } from "./whatsController.js";
import twilio from "twilio";

export class WhatsRoutes {
  static get routes() {
    const router = Router();
    const whatsController = new WhatsController();
    router.post('/',
      twilio.webhook(),
      whatsController.TwilioMessaging
    )
    return router;
  }
}
