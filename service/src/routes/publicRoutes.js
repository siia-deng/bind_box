import express from "express";
import { z } from "zod";
import { BrandPage } from "../models/BrandPage.js";
import { Registration } from "../models/Registration.js";
import { Session } from "../models/Session.js";
import { ShowcaseProject } from "../models/ShowcaseProject.js";
import { Workshop } from "../models/Workshop.js";

export const publicRoutes = express.Router();

const registrationSchema = z.object({
  workshopSlug: z.string().min(1),
  sessionId: z.string().min(1),
  name: z.string().min(2).max(80),
  contact: z.string().min(3).max(120),
  background: z.string().min(2).max(240),
  idea: z.string().min(2).max(1000),
  paymentMethod: z.enum(["wechat", "alipay", "other"]).default("wechat"),
  payerName: z.string().min(1).max(80),
  paymentTail: z.string().min(2).max(12)
});

function createVerificationCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "HC-";
  for (let index = 0; index < 6; index += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function createUniqueVerificationCode() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = createVerificationCode();
    const existing = await Registration.exists({ verificationCode: code });
    if (!existing) {
      return code;
    }
  }

  throw new Error("Could not create verification code");
}

publicRoutes.get("/health", (_req, res) => {
  res.json({ ok: true, service: "hurdle-club-service" });
});

publicRoutes.get("/brand/pages/:slug", async (req, res, next) => {
  try {
    const page = await BrandPage.findOne({ slug: req.params.slug, published: true }).lean();

    if (!page) {
      return res.status(404).json({ message: "Brand page not found" });
    }

    return res.json(page);
  } catch (error) {
    return next(error);
  }
});

publicRoutes.get("/workshops", async (_req, res, next) => {
  try {
    const workshops = await Workshop.find({ status: { $ne: "draft" } }).sort({ createdAt: 1 }).lean();
    return res.json(workshops);
  } catch (error) {
    return next(error);
  }
});

publicRoutes.get("/workshops/:slug", async (req, res, next) => {
  try {
    const workshop = await Workshop.findOne({
      slug: req.params.slug,
      status: { $ne: "draft" }
    }).lean();

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    return res.json(workshop);
  } catch (error) {
    return next(error);
  }
});

publicRoutes.get("/workshops/:slug/sessions", async (req, res, next) => {
  try {
    const workshop = await Workshop.findOne({ slug: req.params.slug }).select("_id").lean();

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    const sessions = await Session.find({ workshop: workshop._id }).sort({ date: 1, startTime: 1 }).lean();
    return res.json(sessions);
  } catch (error) {
    return next(error);
  }
});

publicRoutes.get("/sessions", async (_req, res, next) => {
  try {
    const sessions = await Session.find({})
      .populate("workshop", "slug title")
      .sort({ date: 1, startTime: 1 })
      .lean();

    return res.json(
      sessions.map((session) => ({
        ...session,
        workshopSlug: session.workshop?.slug,
        workshopTitle: session.workshop?.title,
        workshop: session.workshop?._id
      }))
    );
  } catch (error) {
    return next(error);
  }
});

publicRoutes.post("/registrations", async (req, res, next) => {
  try {
    const parsed = registrationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid registration data",
        issues: parsed.error.flatten().fieldErrors
      });
    }

    const workshop = await Workshop.findOne({ slug: parsed.data.workshopSlug, status: "open" });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop is not open for registration" });
    }

    const session = await Session.findOne({
      _id: parsed.data.sessionId,
      workshop: workshop._id
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.seatsTaken >= session.capacity) {
      return res.status(409).json({ message: "This session is full" });
    }

    const verificationCode = await createUniqueVerificationCode();
    const registration = await Registration.create({
      workshop: workshop._id,
      session: session._id,
      name: parsed.data.name,
      contact: parsed.data.contact,
      background: parsed.data.background,
      idea: parsed.data.idea,
      paymentMethod: parsed.data.paymentMethod,
      payerName: parsed.data.payerName,
      paymentTail: parsed.data.paymentTail,
      verificationCode
    });

    session.seatsTaken += 1;
    await session.save();

    return res.status(201).json({
      message: "Registration received",
      registrationId: registration._id,
      verificationCode: registration.verificationCode,
      checkinHint: "现场出示核验码，并报付款昵称/后四位。工作人员核对报名名单后入场。"
    });
  } catch (error) {
    return next(error);
  }
});

publicRoutes.get("/showcase-projects", async (req, res, next) => {
  try {
    const query = { published: true };

    if (req.query.sessionId) {
      query.session = req.query.sessionId;
    }

    if (req.query.year || req.query.month) {
      const year = String(req.query.year ?? "");
      const month = String(req.query.month ?? "").padStart(2, "0");
      query.eventDate = req.query.month ? { $regex: `^${year}-${month}` } : { $regex: `^${year}` };
    }

    if (req.query.workshopSlug) {
      const workshop = await Workshop.findOne({ slug: req.query.workshopSlug }).select("_id").lean();
      if (!workshop) {
        return res.json([]);
      }
      query.workshop = workshop._id;
    }

    const projects = await ShowcaseProject.find(query)
      .populate("workshop", "slug title")
      .populate("session", "date startTime city")
      .sort({ eventDate: -1, createdAt: 1 })
      .lean();

    return res.json(
      projects.map((project) => ({
        ...project,
        workshopSlug: project.workshop?.slug,
        workshopTitle: project.workshop?.title,
        sessionId: String(project.session?._id ?? project.session),
        sessionLabel: project.session
          ? `${project.session.date} ${project.session.startTime} · ${project.session.city}`
          : project.eventDate,
        workshop: project.workshop?._id,
        session: project.session?._id
      }))
    );
  } catch (error) {
    return next(error);
  }
});
