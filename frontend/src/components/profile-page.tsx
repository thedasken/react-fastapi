import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserIcon } from "lucide-react"
import { useAuth } from "@/auth"

type Profile = {
  name: string
  email: string
  avatar: string
}

export function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null

  const profile: Profile = user
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profil</h1>
        <p className="mt-2 text-muted-foreground">
          Consultez les informations de votre profil.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Avatar size="lg">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>
              <UserIcon aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Nom</dt>
              <dd className="font-medium">{profile.name}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Adresse e-mail</dt>
              <dd className="font-medium">{profile.email}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
