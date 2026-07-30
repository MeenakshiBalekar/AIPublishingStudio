"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Field,
  Input,
  Select,
  Textarea,
} from "@/components/ui";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { EMOJI_USAGE_OPTIONS, type BrandFormValues } from "../types";
import type { ActionState } from "../actions";

type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * The Brand Profile form — the single source of truth captured once and reused by every AI
 * generation. Used for both create and edit; the parent passes the bound server action.
 */
export function BrandForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: Action;
  defaultValues?: Partial<BrandFormValues>;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, {});
  const v = defaultValues ?? {};

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
        </CardHeader>
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Brand Name *">
              <Input name="name" defaultValue={v.name} placeholder="Nanhe Sanatani" required />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Description">
              <Textarea
                name="description"
                defaultValue={v.description}
                placeholder="What this brand is about…"
              />
            </Field>
          </div>
          <Field label="Default Author">
            <Input name="defaultAuthor" defaultValue={v.defaultAuthor} />
          </Field>
          <Field label="Website">
            <Input name="website" defaultValue={v.website} placeholder="https://…" />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audience & Voice</CardTitle>
        </CardHeader>
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Target Audience">
            <Input name="targetAudience" defaultValue={v.targetAudience} />
          </Field>
          <Field label="Age Group">
            <Input name="ageGroup" defaultValue={v.ageGroup} placeholder="3-8" />
          </Field>
          <Field label="Writing Tone">
            <Input name="writingTone" defaultValue={v.writingTone} placeholder="Warm, gentle" />
          </Field>
          <Field label="Voice Style">
            <Input name="voiceStyle" defaultValue={v.voiceStyle} placeholder="Storyteller" />
          </Field>
          <Field label="CTA Style">
            <Input name="ctaStyle" defaultValue={v.ctaStyle} placeholder="Soft encouragement" />
          </Field>
          <Field label="Emoji Usage">
            <Select name="emojiUsage" defaultValue={v.emojiUsage ?? "moderate"}>
              {EMOJI_USAGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visual Identity</CardTitle>
        </CardHeader>
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Colors" hint="Comma-separated hex values, e.g. #F59E0B, #DC2626">
              <Input name="colors" defaultValue={v.colors} placeholder="#F59E0B, #DC2626" />
            </Field>
          </div>
          <Field label="Heading Font">
            <Input name="fontHeading" defaultValue={v.fontHeading} placeholder="Baloo 2" />
          </Field>
          <Field label="Body Font">
            <Input name="fontBody" defaultValue={v.fontBody} placeholder="Nunito" />
          </Field>
          <Field label="Logo URL">
            <Input name="logoUrl" defaultValue={v.logoUrl} placeholder="https://…" />
          </Field>
          <Field label="Watermark">
            <Input name="watermark" defaultValue={v.watermark} />
          </Field>
          <Field label="Cover Style">
            <Input name="coverStyle" defaultValue={v.coverStyle} />
          </Field>
          <Field label="Thumbnail Style">
            <Input name="thumbnailStyle" defaultValue={v.thumbnailStyle} />
          </Field>
          <Field label="Instagram Style">
            <Input name="instagramStyle" defaultValue={v.instagramStyle} />
          </Field>
          <Field label="YouTube Style">
            <Input name="youtubeStyle" defaultValue={v.youtubeStyle} />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Marketing Defaults</CardTitle>
        </CardHeader>
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Preferred Hashtags" hint="Comma or newline separated">
            <Textarea
              name="preferredHashtags"
              defaultValue={v.preferredHashtags}
              placeholder="#KidsStories, #BedtimeStories"
            />
          </Field>
          <Field label="Preferred Keywords" hint="Comma or newline separated">
            <Textarea
              name="preferredKeywords"
              defaultValue={v.preferredKeywords}
              placeholder="children's stories, moral stories"
            />
          </Field>
          <Field label="Intro Text">
            <Textarea name="introText" defaultValue={v.introText} />
          </Field>
          <Field label="Outro Text">
            <Textarea name="outroText" defaultValue={v.outroText} />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Instagram">
            <Input name="instagramUrl" defaultValue={v.instagramUrl} placeholder="https://instagram.com/…" />
          </Field>
          <Field label="YouTube">
            <Input name="youtubeUrl" defaultValue={v.youtubeUrl} placeholder="https://youtube.com/@…" />
          </Field>
          <Field label="Facebook">
            <Input name="facebookUrl" defaultValue={v.facebookUrl} />
          </Field>
          <Field label="Pinterest">
            <Input name="pinterestUrl" defaultValue={v.pinterestUrl} />
          </Field>
        </CardBody>
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Link href="/brands" className="text-sm text-muted hover:text-fg">
          Cancel
        </Link>
      </div>
    </form>
  );
}
