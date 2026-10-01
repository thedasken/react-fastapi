import * as React from "react"
import { AlertCircleIcon, Columns3Icon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export type CrudColumn<T> = { key: string; header: string; cell: (row: T) => React.ReactNode; visibleByDefault?: boolean }
type Props<T extends { id: string }> = { rows: T[]; columns: CrudColumn<T>[]; loading?: boolean; error?: string | null; onRetry?: () => void; actions?: (row: T) => React.ReactNode; selected: Set<string>; onSelectedChange: (id: string, checked: boolean) => void; onSelectAll: (checked: boolean) => void; toolbar?: React.ReactNode; columnVisibilityKey?: string }

function defaultVisibleColumnKeys<T>(columns: CrudColumn<T>[]) {
  return new Set(columns.filter((column) => column.visibleByDefault !== false).map((column) => column.key))
}

function getColumnStorageKey(resourceKey: string) {
  let username = "anonymous"
  try {
    username = sessionStorage.getItem("username") ?? username
  } catch {
    // Storage may be unavailable in restricted browser contexts.
  }
  return `crud-table:${encodeURIComponent(username)}:${encodeURIComponent(resourceKey)}:columns`
}

function getInitialVisibleColumnKeys<T>(columns: CrudColumn<T>[], columnVisibilityKey?: string) {
  const defaults = defaultVisibleColumnKeys(columns)
  if (!columnVisibilityKey) return defaults
  try {
    const stored = localStorage.getItem(getColumnStorageKey(columnVisibilityKey))
    if (!stored) return defaults
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed) || !parsed.every((key): key is string => typeof key === "string")) return defaults
    const columnKeys = new Set(columns.map((column) => column.key))
    const visibleKeys = new Set(parsed.filter((key) => columnKeys.has(key)))
    columns.forEach((column) => {
      if (!parsed.includes(column.key) && column.visibleByDefault !== false) visibleKeys.add(column.key)
    })
    return visibleKeys
  } catch {
    return defaults
  }
}

export function CrudTable<T extends { id: string }>({ rows, columns, loading, error, onRetry, actions, selected, onSelectedChange, onSelectAll, toolbar, columnVisibilityKey }: Props<T>) {
  const [visibleColumnKeys, setVisibleColumnKeys] = React.useState(() => getInitialVisibleColumnKeys(columns, columnVisibilityKey))
  const visibleColumns = columns.filter((column) => visibleColumnKeys.has(column.key))
  const columnCount = visibleColumns.length + 2

  React.useEffect(() => {
    if (!columnVisibilityKey) return
    try {
      localStorage.setItem(getColumnStorageKey(columnVisibilityKey), JSON.stringify([...visibleColumnKeys]))
    } catch {
      // Storage may be unavailable or full; visibility remains functional for this session.
    }
  }, [columnVisibilityKey, visibleColumnKeys])

  function toggleColumn(key: string, checked: boolean) {
    setVisibleColumnKeys((current) => {
      const next = new Set(current)
      if (checked) next.add(key)
      else next.delete(key)
      return next
    })
  }

  const columnVisibilityMenu = <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="outline" size="sm" aria-label="Afficher ou masquer les colonnes" />}>
      <Columns3Icon data-icon="inline-start" />Colonnes
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuGroup>
        <DropdownMenuLabel>Colonnes visibles</DropdownMenuLabel>
        {columns.map((column) => <DropdownMenuCheckboxItem key={column.key} checked={visibleColumnKeys.has(column.key)} onCheckedChange={(checked) => toggleColumn(column.key, checked === true)}>{column.header}</DropdownMenuCheckboxItem>)}
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>

  if (error) return <Alert variant="destructive"><AlertCircleIcon /><AlertTitle>Impossible de charger les projets</AlertTitle><AlertDescription>{error} {onRetry && <button className="underline" onClick={onRetry}>Réessayer</button>}</AlertDescription></Alert>
  return <div className="flex flex-col gap-3"><div className="flex items-center justify-between gap-2"><div className="min-w-0 flex-1">{toolbar}</div>{columnVisibilityMenu}</div><div className="overflow-hidden rounded-lg border">
    <Table><TableHeader><TableRow><TableHead className="w-12"><Checkbox aria-label="Sélectionner tout" checked={rows.length > 0 && rows.every((r) => selected.has(r.id))} onCheckedChange={(v) => onSelectAll(v === true)} /></TableHead>{visibleColumns.map((c) => <TableHead key={c.key}>{c.header}</TableHead>)}{actions && <TableHead className="w-24">Actions</TableHead>}</TableRow></TableHeader>
      <TableBody>{loading ? Array.from({ length: 5 }, (_, i) => <TableRow key={i}>{Array.from({ length: columnCount }, (_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>) : rows.length === 0 ? <TableRow><TableCell colSpan={columnCount} className="h-24 text-center text-muted-foreground">Aucun élément trouvé.</TableCell></TableRow> : rows.map((row) => <TableRow key={row.id}><TableCell><Checkbox aria-label={`Sélectionner ${row.id}`} checked={selected.has(row.id)} onCheckedChange={(v) => onSelectedChange(row.id, v === true)} /></TableCell>{visibleColumns.map((c) => <TableCell key={c.key}>{c.cell(row)}</TableCell>)}{actions && <TableCell>{actions(row)}</TableCell>}</TableRow>)}</TableBody>
    </Table>
  </div></div>
}
