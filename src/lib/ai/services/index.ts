import type { AiService } from "../service";

/**
 * The service catalog. Each entry is one generator. Prompts reference the Brand Profile via
 * {{brand.*}} and the project via {{project.*}} — so the same prompt is written once and
 * automatically adapts to every brand (brief: "I should never have to manually rewrite
 * prompts for each brand").
 *
 * A shared brand-context block is prepended to every prompt so each service definition stays
 * focused on its specific task.
 */
const BRAND_CONTEXT = `You are creating publishing content for the brand "{{brand.name}}".
Brand description: {{brand.description}}
Target audience: {{brand.targetAudience}}
Age group: {{brand.ageGroup}}
Writing tone: {{brand.writingTone}}
Voice style: {{brand.voiceStyle}}
Call-to-action style: {{brand.ctaStyle}}
Emoji usage: {{brand.emojiUsage}}
Preferred keywords: {{brand.keywords}}
Preferred hashtags: {{brand.hashtags}}

Content details:
Title: {{project.title}}
Subtitle: {{project.subtitle}}
Content type: {{project.contentType}}
Topic: {{project.topic}}
For age group: {{project.ageGroup}}
Description: {{project.description}}
Language: {{project.language}}
`;

const SYSTEM = `You are an expert publishing and marketing copywriter for children's content brands. You always match the brand's tone, voice and audience exactly, and you write copy that is ready to publish with no placeholders.`;

/** Helper to assemble a full prompt template with the shared brand context. */
function svc(
  s: Omit<AiService, "system" | "promptTemplate"> & { task: string },
): AiService {
  const { task, ...rest } = s;
  return {
    ...rest,
    system: SYSTEM,
    promptTemplate: `${BRAND_CONTEXT}\n---\nTask: ${task}\n\nWrite in {{project.language}}. Match the brand tone. Output only the requested content with no preamble or explanation.`,
  };
}

export const AI_SERVICES: AiService[] = [
  // ------------------------------------------------------------------ Instagram
  svc({
    key: "instagram.caption",
    label: "Instagram Caption",
    platform: "instagram",
    kind: "caption",
    description: "An engaging feed caption with a hook and CTA.",
    task: "Write an engaging Instagram feed caption. Start with a scroll-stopping hook, keep it on-brand, and end with a call to action in the brand's CTA style. Include a few relevant emojis if the brand uses them.",
  }),
  svc({
    key: "instagram.carousel",
    label: "Instagram Carousel",
    platform: "instagram",
    kind: "carousel",
    description: "Slide-by-slide text for a carousel post.",
    task: "Write text for a 5-slide Instagram carousel. Label each slide (Slide 1, Slide 2, …). Slide 1 is a hook, slides 2-4 deliver value about the content, slide 5 is a call to action.",
    maxTokens: 1200,
  }),
  svc({
    key: "instagram.reel",
    label: "Reel Caption",
    platform: "instagram",
    kind: "reel_caption",
    description: "A short punchy caption for a Reel.",
    task: "Write a short, punchy Instagram Reel caption with a strong hook and a clear call to action.",
  }),
  svc({
    key: "instagram.story",
    label: "Instagram Story",
    platform: "instagram",
    kind: "story",
    description: "Text for a promotional story frame.",
    task: "Write concise text for an Instagram Story frame promoting this content, with a swipe-up / link call to action.",
    maxTokens: 600,
  }),
  svc({
    key: "instagram.hashtags",
    label: "Instagram Hashtags",
    platform: "instagram",
    kind: "hashtags",
    description: "A ready-to-paste set of hashtags.",
    task: "Produce 20-25 relevant Instagram hashtags as a single space-separated line. Include the brand's preferred hashtags plus topical ones for this content. No numbering.",
    maxTokens: 400,
  }),

  // ------------------------------------------------------------------ YouTube
  svc({
    key: "youtube.seo_title",
    label: "YouTube SEO Title",
    platform: "youtube",
    kind: "seo_title",
    description: "A click-worthy, keyword-rich title.",
    task: "Write one click-worthy, SEO-optimized YouTube title (max 70 characters) for this content.",
    maxTokens: 200,
  }),
  svc({
    key: "youtube.description",
    label: "YouTube Description",
    platform: "youtube",
    kind: "description",
    description: "A full description with keywords and links.",
    task: "Write a full YouTube video description: an engaging opening paragraph, a short bullet list of what viewers will enjoy, relevant keywords woven in naturally, and a closing call to action to like and subscribe.",
    maxTokens: 1200,
  }),
  svc({
    key: "youtube.tags",
    label: "YouTube Tags",
    platform: "youtube",
    kind: "tags",
    description: "Comma-separated video tags.",
    task: "Produce a comma-separated list of 15-20 YouTube tags relevant to this content and brand.",
    maxTokens: 400,
  }),
  svc({
    key: "youtube.thumbnail_prompt",
    label: "Thumbnail Prompt",
    platform: "youtube",
    kind: "thumbnail_prompt",
    description: "An image-generation prompt for the thumbnail.",
    task: "Write a detailed image-generation prompt for a YouTube thumbnail that matches the brand's thumbnail style. Describe scene, characters, colors, mood and any short overlay text.",
    maxTokens: 500,
  }),
  svc({
    key: "youtube.chapters",
    label: "YouTube Chapters",
    platform: "youtube",
    kind: "chapters",
    description: "Timestamped chapter markers.",
    task: "Write a plausible set of YouTube chapter timestamps for this content, starting at 0:00, one per line as 'M:SS Title'.",
    maxTokens: 500,
  }),
  svc({
    key: "youtube.pinned_comment",
    label: "Pinned Comment",
    platform: "youtube",
    kind: "pinned_comment",
    description: "A friendly pinned comment to boost engagement.",
    task: "Write a friendly pinned comment from the creator that asks a question to boost engagement and includes the brand's call to action.",
    maxTokens: 400,
  }),

  // ------------------------------------------------------------------ Amazon KDP
  svc({
    key: "kdp.description",
    label: "KDP Book Description",
    platform: "kdp",
    kind: "description",
    description: "A compelling Amazon book description.",
    task: "Write a compelling Amazon KDP book description with a strong opening hook, the benefits for parents and children, and a closing line that encourages purchase. Keep it skimmable.",
    maxTokens: 1200,
  }),
  svc({
    key: "kdp.backend_keywords",
    label: "KDP Backend Keywords",
    platform: "kdp",
    kind: "backend_keywords",
    description: "Seven backend keyword strings.",
    task: "Produce 7 Amazon KDP backend keyword phrases (one per line), each a distinct search phrase a parent might use to find this content. Avoid repeating words already in the title.",
    maxTokens: 400,
  }),
  svc({
    key: "kdp.categories",
    label: "KDP Categories",
    platform: "kdp",
    kind: "categories",
    description: "Suggested Amazon browse categories.",
    task: "Suggest 3 relevant Amazon KDP browse categories (full category paths) for this content.",
    maxTokens: 300,
  }),
  svc({
    key: "kdp.author_bio",
    label: "Author Bio",
    platform: "kdp",
    kind: "author_bio",
    description: "A short author/brand bio.",
    task: "Write a warm 2-3 sentence author bio for {{brand.defaultAuthor}} that fits this brand and builds trust with parents.",
    maxTokens: 400,
  }),
  svc({
    key: "kdp.aplus",
    label: "A+ Content Suggestions",
    platform: "kdp",
    kind: "aplus",
    description: "Ideas for Amazon A+ content modules.",
    task: "Suggest 4 Amazon A+ content module ideas for this book, each with a short heading and a one-line description of the visual and copy.",
    maxTokens: 700,
  }),

  // ------------------------------------------------------------------ Gumroad
  svc({
    key: "gumroad.title",
    label: "Gumroad Product Title",
    platform: "gumroad",
    kind: "title",
    description: "A benefit-driven product title.",
    task: "Write a benefit-driven Gumroad product title for this content (max 80 characters).",
    maxTokens: 200,
  }),
  svc({
    key: "gumroad.description",
    label: "Gumroad Description",
    platform: "gumroad",
    kind: "description",
    description: "A product description that sells.",
    task: "Write a Gumroad product description that opens with a hook, explains what the buyer gets and why it helps their child, and closes with a call to action.",
    maxTokens: 1000,
  }),
  svc({
    key: "gumroad.features",
    label: "Gumroad Features",
    platform: "gumroad",
    kind: "features",
    description: "A bulleted feature list.",
    task: "Write a bulleted list of 5-7 features/benefits of this product for a Gumroad listing.",
    maxTokens: 500,
  }),
  svc({
    key: "gumroad.faq",
    label: "Gumroad FAQ",
    platform: "gumroad",
    kind: "faq",
    description: "Common buyer questions answered.",
    task: "Write 4 frequently asked questions with concise answers for this product's Gumroad page.",
    maxTokens: 700,
  }),
  svc({
    key: "gumroad.sales_copy",
    label: "Gumroad Sales Copy",
    platform: "gumroad",
    kind: "sales_copy",
    description: "Persuasive long-form sales copy.",
    task: "Write persuasive long-form sales copy for this product: headline, problem, solution, what's inside, and a strong closing call to action.",
    maxTokens: 1200,
  }),

  // ------------------------------------------------------------------ Pinterest
  svc({
    key: "pinterest.pin_title",
    label: "Pin Title",
    platform: "pinterest",
    kind: "pin_title",
    description: "A keyword-rich Pin title.",
    task: "Write a keyword-rich Pinterest Pin title (max 100 characters) for this content.",
    maxTokens: 200,
  }),
  svc({
    key: "pinterest.description",
    label: "Pin Description",
    platform: "pinterest",
    kind: "description",
    description: "A searchable Pin description.",
    task: "Write a Pinterest Pin description with natural keywords and a call to action, plus 3-5 relevant hashtags at the end.",
    maxTokens: 500,
  }),

  // ------------------------------------------------------------------ Facebook
  svc({
    key: "facebook.caption",
    label: "Facebook Caption",
    platform: "facebook",
    kind: "caption",
    description: "A shareable Facebook post caption.",
    task: "Write a friendly, shareable Facebook post caption for this content with a clear call to action.",
    maxTokens: 600,
  }),

  // ------------------------------------------------------------------ Blog
  svc({
    key: "blog.article",
    label: "Blog Article",
    platform: "blog",
    kind: "article",
    description: "A short SEO blog article.",
    task: "Write a short (400-600 word) SEO-friendly blog article about this content for the brand's blog, with a title, an intro, 2-3 subheadings, and a closing call to action.",
    maxTokens: 2000,
  }),

  // ------------------------------------------------------------------ Email
  svc({
    key: "email.launch",
    label: "Launch Email",
    platform: "email",
    kind: "launch",
    description: "A launch announcement email.",
    task: "Write a launch announcement email for this content: subject line, preview text, a warm body that builds excitement, and a call to action button label.",
    maxTokens: 1000,
  }),
];
