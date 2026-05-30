import "dotenv/config";
import { connectDatabase, disconnectDatabase } from "./db.js";
import { brandPages, sessions, showcaseProjects, workshops } from "./data/seedData.js";
import { BrandPage } from "./models/BrandPage.js";
import { Session } from "./models/Session.js";
import { ShowcaseProject } from "./models/ShowcaseProject.js";
import { Workshop } from "./models/Workshop.js";

async function seed() {
  await connectDatabase();

  for (const page of brandPages) {
    await BrandPage.findOneAndUpdate({ slug: page.slug }, page, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    });
  }

  const workshopMap = new Map();
  for (const workshop of workshops) {
    const document = await Workshop.findOneAndUpdate({ slug: workshop.slug }, workshop, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    });
    workshopMap.set(workshop.slug, document);
  }

  for (const session of sessions) {
    const workshop = workshopMap.get(session.workshopSlug);
    if (!workshop) {
      throw new Error(`Missing workshop for session: ${session.workshopSlug}`);
    }

    await Session.findOneAndUpdate(
      {
        workshop: workshop._id,
        date: session.date,
        startTime: session.startTime
      },
      {
        workshop: workshop._id,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        city: session.city,
        venue: session.venue,
        capacity: session.capacity,
        seatsTaken: session.seatsTaken
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  for (const project of showcaseProjects) {
    const workshop = workshopMap.get(project.workshopSlug);
    if (!workshop) {
      throw new Error(`Missing workshop for project: ${project.title}`);
    }

    const session = await Session.findOne({
      workshop: workshop._id,
      date: project.sessionDate,
      startTime: project.sessionStartTime
    });

    if (!session) {
      throw new Error(`Missing session for project: ${project.title}`);
    }

    await ShowcaseProject.findOneAndUpdate({ title: project.title, maker: project.maker }, {
      title: project.title,
      maker: project.maker,
      summary: project.summary,
      workshop: workshop._id,
      session: session._id,
      eventDate: session.date,
      tags: project.tags,
      link: project.link,
      published: project.published
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    });
  }

  await disconnectDatabase();
  console.log("Seed data written.");
}

seed().catch(async (error) => {
  console.error(error);
  await disconnectDatabase();
  process.exit(1);
});
