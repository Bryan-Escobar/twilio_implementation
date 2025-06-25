import { Router } from "express";
import { WhatsRoutes } from "./whatsapp-bot/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();


    router.use("/api/whatsapp-bot", WhatsRoutes.routes);



    router.get("/api/overview", (req, res) => {
      console.log("la api esta funcionando correctamente");
      res.status(200).json({
        message: "API is running",
      });
    });

    return router;
  }
}
