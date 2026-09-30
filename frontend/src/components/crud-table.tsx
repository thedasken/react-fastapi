import * as React from "react"
import { AlertCircleIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export type CrudColumn<T> = { key: string; header: string; cell: (row: T) => React.ReactNode }
type Props<T extends { id: string }> = { rows: T[]; columns: CrudColumn<T>[]; loading?: boolean; error?: string | null; onRetry?: () => void; actions?: (row: T) => React.ReactNode; selected: Set<string>; onSelectedChange: (id: string, checked: boolean) => void; onSelectAll: (checked: boolean) => void; toolbar?: React.ReactNode }

export function CrudTable<T extends { id: string }>({ rows, columns, loading, error, onRetry, actions, selected, onSelectedChange, onSelectAll, toolbar }: Props<T>) {
  if (error) return <Alert variant="destructive"><AlertCircleIcon /><AlertTitle>Impossible de charger les projets</AlertTitle><AlertDescription>{error} {onRetry && <button className="underline" onClick={onRetry}>Réessayer</button>}</AlertDescription></Alert>
  return <div className="flex flex-col gap-3">{toolbar}<div className="overflow-hidden rounded-lg border">
    <Table><TableHeader><TableRow><TableHead className="w-12"><Checkbox aria-label="Sélectionner tout" checked={rows.length > 0 && rows.every((r) => selected.has(r.id))} onCheckedChange={(v) => onSelectAll(v === true)} /></TableHead>{columns.map((c) => <TableHead key={c.key}>{c.header}</TableHead>)}{actions && <TableHead className="w-24">Actions</TableHead>}</TableRow></TableHeader>
      <TableBody>{loading ? Array.from({ length: 5 }, (_, i) => <TableRow key={i}>{Array.from({ length: columns.length + 2 }, (_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>) : rows.length === 0 ? <TableRow><TableCell colSpan={columns.length + 2} className="h-24 text-center text-muted-foreground">Aucun élément trouvé.</TableCell></TableRow> : rows.map((row) => <TableRow key={row.id}><TableCell><Checkbox aria-label={`Sélectionner ${row.id}`} checked={selected.has(row.id)} onCheckedChange={(v) => onSelectedChange(row.id, v === true)} /></TableCell>{columns.map((c) => <TableCell key={c.key}>{c.cell(row)}</TableCell>)}{actions && <TableCell>{actions(row)}</TableCell>}</TableRow>)}</TableBody>
    </Table>
  </div></div>
}
