/**
 * Seed data. Creates the example brands from the brief so the app is usable on first run.
 * Idempotent: safe to run multiple times (upserts by unique slug).
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const brands = [
    {
      slug: "nanhe-sanatani",
      name: "Nanhe Sanatani",
      description: "Rooted stories that introduce children to Sanatan values and culture.",
      targetAudience: "Indian parents seeking values-based content for young children",
      ageGroup: "3-8",
      writingTone: "Warm, gentle, culturally rooted",
      voiceStyle: "Storyteller, nurturing",
      ctaStyle: "Soft encouragement to follow and share",
      colors: JSON.stringify(["#F59E0B", "#DC2626", "#FDE68A"]),
      fonts: JSON.stringify({ heading: "Baloo 2", body: "Nunito" }),
      emojiUsage: "moderate",
      preferredHashtags: JSON.stringify([
        "#NanheSanatani",
        "#KidsStories",
        "#SanatanKids",
        "#BedtimeStories",
        "#IndianCulture",
      ]),
      preferredKeywords: JSON.stringify([
        "children's stories",
        "moral stories",
        "Indian culture for kids",
      ]),
      defaultAuthor: "Nanhe Sanatani",
      website: "",
    },
    {
      slug: "yellow-berry-tv",
      name: "Yellow Berry TV",
      description: "Playful, colorful learning videos and printables for little ones.",
      targetAudience: "Parents of toddlers and preschoolers",
      ageGroup: "2-6",
      writingTone: "Cheerful, energetic, simple",
      voiceStyle: "Fun and upbeat",
      ctaStyle: "Excited, subscribe-focused",
      colors: JSON.stringify(["#FACC15", "#22C55E", "#3B82F6"]),
      fonts: JSON.stringify({ heading: "Fredoka", body: "Poppins" }),
      emojiUsage: "heavy",
      preferredHashtags: JSON.stringify([
        "#YellowBerryTV",
        "#KidsLearning",
        "#Preschool",
        "#NurseryRhymes",
      ]),
      preferredKeywords: JSON.stringify(["kids learning", "nursery rhymes", "preschool videos"]),
      defaultAuthor: "Yellow Berry TV",
      website: "",
    },
    {
      slug: "kids-bedtime-stories",
      name: "Kids Bedtime Stories",
      description: "Calming bedtime tales that help children drift off to sleep.",
      targetAudience: "Parents looking for soothing bedtime content",
      ageGroup: "3-9",
      writingTone: "Soft, soothing, dreamy",
      voiceStyle: "Calm narrator",
      ctaStyle: "Gentle, restful",
      colors: JSON.stringify(["#6366F1", "#8B5CF6", "#1E293B"]),
      fonts: JSON.stringify({ heading: "Quicksand", body: "Nunito" }),
      emojiUsage: "light",
      preferredHashtags: JSON.stringify([
        "#BedtimeStories",
        "#KidsBedtime",
        "#SleepStories",
        "#StoriesForKids",
      ]),
      preferredKeywords: JSON.stringify(["bedtime stories", "sleep stories", "stories for kids"]),
      defaultAuthor: "Kids Bedtime Stories",
      website: "",
    },
  ];

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: brand,
      create: brand,
    });
  }

  console.log(`Seeded ${brands.length} brands.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
