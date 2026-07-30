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
import { CONTENT_TYPES } from "@/lib/domain/content-types";
import type { ProjectFormValues } from "../types";
import type { ActionState } from "../actions";

type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

export function ProjectForm({
  action,
  brands,
  defaultValues,
  submitLabel,
  cancelHref = "/projects",
}: {
  action: Action;
  brands: { id: string; name: string }[];
  defaultValues?: Partial<ProjectFormValues>;
  submitLabel: string;
  cancelHref?: string;
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
          <CardTitle>Basics</CardTitle>
        </CardHeader>
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand *">
            <Select name="brandId" defaultValue={v.brandId} required>
              <option value="">Select a brand…</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Content Type *">
            <Select name="contentType" defaultValue={v.contentType} required>
              <option value="">Select a type…</option>
              {CONTENT_TYPES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.icon} {c.label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Title *">
              <Input name="title" defaultValue={v.title} placeholder="The Little Lamp of Diwali" required />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Subtitle">
              <Input name="subtitle" defaultValue={v.subtitle} />
            </Field>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Topic">
            <Input name="topic" defaultValue={v.topic} placeholder="Festival of lights" />
          </Field>
          <Field label="Age Group">
            <Input name="ageGroup" defaultValue={v.ageGroup} placeholder="3-8" />
          </Field>
          <Field label="Language">
            <Input name="language" defaultValue={v.language ?? "English"} />
          </Field>
          <Field label="Keywords" hint="Comma or newline separated">
            <Input name="keywords" defaultValue={v.keywords} placeholder="diwali, festival, lamp" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description">
              <Textarea name="description" defaultValue={v.description} />
            </Field>
          </div>
        </CardBody>
      </Card>

      <div className="flex items-center gap-3">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Link href={cancelHref} className="text-sm text-muted hover:text-fg">
          Cancel
        </Link>
      </div>
    </form>
  );
}
