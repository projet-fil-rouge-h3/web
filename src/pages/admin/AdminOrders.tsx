import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Typography } from '@mui/material'
import { adminApi } from '@/services/admin'
import OrdersTable from './OrdersTable'
import type { OrderResponse, OrderStatus } from '@/services/orders'

export default function AdminOrders() {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null)

  const { data: ordersPage, isLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => adminApi.getAllOrders(0, 50),
  })

  const updateStatus = useMutation({
    mutationFn: ({ order, status }: { order: OrderResponse; status: OrderStatus }) =>
      adminApi.updateOrderStatus(order.id, status),
    onMutate: ({ order }) => setUpdatingOrderId(order.id),
    onSettled: () => setUpdatingOrderId(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
    },
    onError: () => setError('La mise à jour du statut a échoué.'),
  })

  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Toutes les commandes ({ordersPage?.totalElements ?? 0})
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <OrdersTable
        orders={ordersPage?.content ?? []}
        loading={isLoading}
        onStatusChange={(order, status) => updateStatus.mutate({ order, status })}
        updatingOrderId={updatingOrderId}
      />
    </>
  )
}
