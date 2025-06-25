import { Router } from "express";

import { WhatsController } from "./whatsController.js";

export class WhatsRoutes {
  static get routes() {
    const router = Router();
    const whatsController = new WhatsController();
    router.post('/',
      whatsController.TwilioMessaging
    )
    return router;
  }
}
