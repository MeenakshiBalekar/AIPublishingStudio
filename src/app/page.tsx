import { ButtonLink, Card, CardBody, PageHeader } from "@/components/ui";

/**
 * Placeholder dashboard. The full dashboard (stats, recent activity, quick actions,
 * upcoming publishing tasks) is delivered in module M6 once projects and brands exist.
 */
export default function HomePage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Your publishing operating system."
        action={<ButtonLink href="/projects/new">+ New Project</ButtonLink>}
      />

      <Card>
        <CardBody className="flex flex-col items-start gap-3">
          <span className="text-3xl">✦</span>
          <h2 className="text-lg font-semibold">Welcome to AI Publishing Studio</h2>
          <p className="max-w-xl text-sm text-muted">
            Upload a finished book or piece of content and generate every asset you need to
            publish and market it — Instagram, YouTube, KDP, Gumroad, Pinterest and more —
            while tracking your publishing checklist in one place.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <ButtonLink href="/brands/new" variant="secondary">
              Create your first Brand
            </ButtonLink>
            <ButtonLink href="/projects/new" variant="outline">
              Start a Project
            </ButtonLink>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
