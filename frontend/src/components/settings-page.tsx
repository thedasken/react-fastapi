import { useTheme, type Theme } from "@/components/theme-provider"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

const themeOptions: { value: Theme; label: string }[] = [
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
  { value: "system", label: "Système" },
]

export function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres</h1>
        <p className="mt-2 text-muted-foreground">
          Gérez les préférences d&apos;apparence de l&apos;application.
        </p>
      </div>
      <section className="flex flex-col gap-4 rounded-xl border bg-card p-6">
        <div>
          <h2 className="font-medium">Apparence</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choisissez le thème utilisé par l&apos;application.
          </p>
        </div>
        <ToggleGroup
          value={[theme]}
          onValueChange={(values) => {
            const value = values[0]
            if (value === "light" || value === "dark" || value === "system") {
              setTheme(value)
            }
          }}
          variant="outline"
          aria-label="Choisir le thème"
        >
          {themeOptions.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </section>
    </div>
  )
}
