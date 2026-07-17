import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Chip,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useAuthStore } from '@/stores/authStore'
import { adminApi } from '@/services/admin'
import type { AdminUser } from '@/services/admin'

export default function AdminUsers() {
  const queryClient = useQueryClient()
  const currentUser = useAuthStore((s) => s.user)
  const [error, setError] = useState<string | null>(null)

  const { data: usersPage, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.getUsers(0, 50),
  })

  const updateUser = useMutation({
    mutationFn: ({ user, payload }: { user: AdminUser; payload: { active?: boolean; role?: 'USER' | 'ADMIN' } }) =>
      adminApi.updateUser(user.id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
    onError: (e: Error) => setError(e.message || "La mise à jour de l'utilisateur a échoué."),
  })

  const users = usersPage?.content ?? []

  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Utilisateurs ({usersPage?.totalElements ?? 0})
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {isLoading ? (
        <Skeleton variant="rounded" height={240} />
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>E-mail</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Rôle</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Inscription</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actif</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => {
                // Miroir du garde-fou backend : pas d'auto-désactivation/rétrogradation
                const isSelf = currentUser?.id === u.id
                return (
                  <TableRow key={u.id} hover sx={{ opacity: u.active ? 1 : 0.5 }}>
                    <TableCell>
                      {u.firstName} {u.lastName}
                      {isSelf && <Chip label="vous" size="small" sx={{ ml: 1 }} />}
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={u.role}
                        disabled={isSelf || updateUser.isPending}
                        onChange={(e) =>
                          updateUser.mutate({ user: u, payload: { role: e.target.value as 'USER' | 'ADMIN' } })
                        }
                        inputProps={{ 'aria-label': `Rôle de ${u.email}` }}
                      >
                        <MenuItem value="USER">USER</MenuItem>
                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '—'}
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={u.active}
                        size="small"
                        disabled={isSelf || updateUser.isPending}
                        onChange={() => updateUser.mutate({ user: u, payload: { active: !u.active } })}
                        slotProps={{ input: { 'aria-label': `Activer/désactiver ${u.email}` } }}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  )
}
