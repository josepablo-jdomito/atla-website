import type { Request, Response } from "express";
import { app, ready } from "../server/app.ts";

export default async function handler(req: Request, res: Response) {
  await ready;
  app(req, res);
}
