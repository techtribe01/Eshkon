import { cookies } from 'next/headers'

import type { Role } from '../types'

export function getRole(): Role {
  const role = cookies().get('role')?.value

  if (role === 'editor' || role === 'publisher') {
    return role
  }

  return 'viewer'
}

export function hasPermission(role: Role, action: 'edit' | 'publish'): boolean {
  if (role === 'publisher') {
    return true
  }

  if (role === 'editor') {
    return action === 'edit'
  }

  return false
}
