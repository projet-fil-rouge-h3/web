import {
  Chip,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import type { OrderResponse, OrderStatus } from '@/services/orders'

export const STATUS_LABEL: Record<string, string> = {
  PENDING: 'En attente',
  VALIDATED: 'Validée',
  CONFIRMED: 'Confirmée',
  PROCESSING: 'En cours',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
  REFUNDED: 'Remboursée',
}

export const STATUS_COLOR: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  PENDING: 'warning',
  VALIDATED: 'success',
  CONFIRMED: 'success',
  PROCESSING: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'error',
  REFUNDED: 'default',
}

const EDITABLE_STATUSES: OrderStatus[] = [
  'PENDING',
  'VALIDATED',
  'PROCESSING',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
]

interface OrdersTableProps {
  orders: OrderResponse[]
  loading: boolean
  /** Si fourni, le statut devient éditable via un Select par ligne. */
  onStatusChange?: (order: OrderResponse, status: OrderStatus) => void
  updatingOrderId?: number | null
}

export default function OrdersTable({ orders, loading, onStatusChange, updatingOrderId }: OrdersTableProps) {
  if (loading) return <Skeleton variant="rounded" height={240} />
  if (orders.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary', py: 4, textAlign: 'center' }}>
        Aucune commande.
      </Typography>
    )
  }
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Commande</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Client</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Articles</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Statut</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="right">Total HT</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} hover>
              <TableCell sx={{ fontFamily: 'monospace' }}>
                #{String(order.id).padStart(6, '0')}
              </TableCell>
              <TableCell>
                {order.user ? (
                  <>
                    {order.user.firstName} {order.user.lastName}
                    <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                      {order.user.email}
                    </Typography>
                  </>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell>
                {order.items.map((i) => `${i.productName} ×${i.quantity}`).join(', ')}
              </TableCell>
              <TableCell>
                {onStatusChange ? (
                  <Select
                    size="small"
                    value={order.status}
                    disabled={updatingOrderId === order.id}
                    onChange={(e) => onStatusChange(order, e.target.value as OrderStatus)}
                    sx={{ minWidth: 140 }}
                    inputProps={{ 'aria-label': `Statut de la commande ${order.id}` }}
                  >
                    {EDITABLE_STATUSES.map((s) => (
                      <MenuItem key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Chip
                    label={STATUS_LABEL[order.status] ?? order.status}
                    color={STATUS_COLOR[order.status] ?? 'default'}
                    size="small"
                  />
                )}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                {order.totalAmount.toLocaleString('fr-FR')} €
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
