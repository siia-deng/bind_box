export type BrandPage = {
  slug: string;
  title: string;
  eyebrow: string;
  body: string;
  sections: Array<{
    heading: string;
    copy: string;
  }>;
};

export type Workshop = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription?: string[];
  audience: string[];
  outcomes: string[];
  agenda: Array<{
    time: string;
    title: string;
    description: string;
  }>;
  tags: string[];
  status: string;
};

export type Session = {
  _id: string;
  workshopSlug?: string;
  workshopTitle?: string;
  date: string;
  startTime: string;
  endTime: string;
  city: string;
  venue: string;
  capacity: number;
  seatsTaken: number;
};

export type ShowcaseProject = {
  _id: string;
  title: string;
  summary: string;
  maker: string;
  workshopSlug: string;
  workshopTitle: string;
  sessionId: string;
  sessionLabel: string;
  eventDate: string;
  tags: string[];
  link?: string;
};
