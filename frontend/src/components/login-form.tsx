import { useState } from "react"
import type { FormEvent } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/auth"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { login, sessionExpired } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null); setPending(true)
    try { await login(username, password) } catch (err) { setError(err instanceof Error ? err.message : "Une erreur est survenue") } finally { setPending(false) }
  }

  return <div className={cn("flex flex-col gap-6", className)} {...props}>
    <Card><CardHeader><CardTitle>Connexion</CardTitle><CardDescription>Connectez-vous à votre espace administrateur</CardDescription></CardHeader>
      <CardContent><form onSubmit={handleSubmit}><FieldGroup>
        <Field><FieldLabel htmlFor="username">Identifiant</FieldLabel><Input id="username" value={username} onChange={(event) => setUsername(event.target.value)} required autoComplete="username" autoFocus /></Field>
        <Field><FieldLabel htmlFor="password">Mot de passe</FieldLabel><Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></Field>
        {sessionExpired && <FieldDescription>Votre session a expiré. Veuillez vous reconnecter.</FieldDescription>}
        {error && <FieldDescription className="text-destructive">{error}</FieldDescription>}
        <Field><Button type="submit" disabled={pending}>{pending ? "Connexion…" : "Se connecter"}</Button></Field>
      </FieldGroup></form></CardContent>
    </Card>
  </div>
}
