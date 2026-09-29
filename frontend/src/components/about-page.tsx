import logoBanner from "@/assets/logo_banner.png"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoIcon, ShieldAlertIcon } from "lucide-react"

const appVersion = import.meta.env.APP_VERSION

export function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <Card className="overflow-hidden pt-0">
        <div className="bg-[#f1f1f1]">
          <img
            src={logoBanner}
            alt="Bannière du FANLab"
            className="block h-auto w-full"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">A propos</CardTitle>
          <p className="text-muted-foreground">
            Une application créée par le FANLab pour l&apos;expérimentation et la
            démonstration.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Alert>
            <InfoIcon />
            <AlertTitle>À propos de cette application</AlertTitle>
            <AlertDescription>
              Cette application est actuellement un prototype développé par le
              FANLab. Elle a vocation à servir d&apos;espace d&apos;expérimentation et
              de démonstration, et peut évoluer ou être temporairement
              indisponible.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <ShieldAlertIcon />
            <AlertTitle>Responsabilité et confidentialité</AlertTitle>
            <AlertDescription>
              Cette application ne doit pas être utilisée comme outil
              indispensable ou comme unique moyen de travail. Les données qui y
              sont manipulées peuvent être classifiées et doivent être traitées
              conformément aux règles applicables. Chaque utilisateur est
              responsable de l&apos;usage qu&apos;il fait de l&apos;application et des
              informations qu&apos;il y saisit ou en extrait.
            </AlertDescription>
          </Alert>

          <section className="flex flex-col gap-4 rounded-lg border p-4">
            <h2 className="font-medium">Contact & informations utiles</h2>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <dt className="text-muted-foreground">Développeur</dt>
                <dd className="font-medium">FANLab Toulon</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-muted-foreground">Version de l'application</dt>
                <dd className="font-medium">{appVersion}</dd>
              </div>
            </dl>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
