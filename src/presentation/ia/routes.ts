import { Router } from "express";
import { IaController } from "./IaController.js";
import { SupabaseAuthMiddleware } from "../middlewares/supabase-auth.middleware.js";

export class IaRoutes {
  static get routes() {
    const router = Router();
    const iaController = new IaController();
    router.post("/:modelo", SupabaseAuthMiddleware.validarSessionToken, iaController.Preguntar);
    router.post("/chat/:modelo", SupabaseAuthMiddleware.validarSessionToken, iaController.Chat);
    return router;
  }
}
