import Link from 'next/link'
import { cookies } from 'next/headers'

import type { Role } from '../types'

async function setRoleAction(formData: FormData) {
  'use server'

  const role = formData.get('role')

  if (role === 'viewer' || role === 'editor' || role === 'publisher') {
    cookies().set('role', role)
  }
}

export default function HomePage() {
  const role = cookies().get('role')?.value
  const currentRole: Role =
    role === 'editor' || role === 'publisher' ? role : 'viewer'

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold">Page Studio</h1>
      <p className="mt-2 text-sm text-gray-600">Current role: {currentRole}</p>

      <div className="mt-6 flex flex-wrap gap-4">
        <form action={setRoleAction}>
          <input type="hidden" name="role" value="viewer" />
          <button
            type="submit"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            aria-label="Set role as viewer"
          >
            Set role as Viewer
          </button>
        </form>
        <form action={setRoleAction}>
          <input type="hidden" name="role" value="editor" />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            aria-label="Set role as editor"
          >
            Set role as Editor
          </button>
        </form>
        <form action={setRoleAction}>
          <input type="hidden" name="role" value="publisher" />
          <button
            type="submit"
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            aria-label="Set role as publisher"
          >
            Set role as Publisher
          </button>
        </form>
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          className="text-sm font-medium text-blue-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          href="/preview/home"
          aria-label="Go to preview home"
        >
          Preview Home
        </Link>
        <Link
          className="text-sm font-medium text-blue-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          href="/studio/home"
          aria-label="Go to studio home"
        >
          Studio Home
        </Link>
      </div>
    </main>
  )
}
