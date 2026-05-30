import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { BrandPage } from "../models/BrandPage.js";
import { Registration } from "../models/Registration.js";
import { Session } from "../models/Session.js";
import { ShowcaseProject } from "../models/ShowcaseProject.js";
import { Workshop } from "../models/Workshop.js";

export const adminRoutes = express.Router();

adminRoutes.use(adminAuth);

const resources = {
  "brand-pages": BrandPage,
  workshops: Workshop,
  sessions: Session,
  registrations: Registration,
  "showcase-projects": ShowcaseProject
};

function getModel(resource) {
  return resources[resource] ?? null;
}

adminRoutes.get("/registrations/checkin/:verificationCode", async (req, res, next) => {
  try {
    const registration = await Registration.findOne({
      verificationCode: req.params.verificationCode.toUpperCase()
    })
      .populate("workshop", "slug title")
      .populate("session", "date startTime city venue")
      .lean();

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    return res.json(registration);
  } catch (error) {
    return next(error);
  }
});

adminRoutes.post("/registrations/checkin/:verificationCode", async (req, res, next) => {
  try {
    const registration = await Registration.findOneAndUpdate(
      { verificationCode: req.params.verificationCode.toUpperCase() },
      {
        checkinStatus: "checked_in",
        status: "confirmed"
      },
      { new: true, runValidators: true }
    )
      .populate("workshop", "slug title")
      .populate("session", "date startTime city venue");

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    return res.json(registration);
  } catch (error) {
    return next(error);
  }
});

adminRoutes.get("/:resource", async (req, res, next) => {
  try {
    const Model = getModel(req.params.resource);
    if (!Model) {
      return res.status(404).json({ message: "Unknown admin resource" });
    }

    const documents = await Model.find({}).sort({ createdAt: -1 }).lean();
    return res.json(documents);
  } catch (error) {
    return next(error);
  }
});

adminRoutes.post("/:resource", async (req, res, next) => {
  try {
    const Model = getModel(req.params.resource);
    if (!Model) {
      return res.status(404).json({ message: "Unknown admin resource" });
    }

    const document = await Model.create(req.body);
    return res.status(201).json(document);
  } catch (error) {
    return next(error);
  }
});

adminRoutes.patch("/:resource/:id", async (req, res, next) => {
  try {
    const Model = getModel(req.params.resource);
    if (!Model) {
      return res.status(404).json({ message: "Unknown admin resource" });
    }

    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.json(document);
  } catch (error) {
    return next(error);
  }
});

adminRoutes.delete("/:resource/:id", async (req, res, next) => {
  try {
    const Model = getModel(req.params.resource);
    if (!Model) {
      return res.status(404).json({ message: "Unknown admin resource" });
    }

    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});
