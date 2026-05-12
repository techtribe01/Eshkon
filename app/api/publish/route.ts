import { promises as fs } from 'fs'
import path from 'path'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { Page, PublishedRelease } from '../../../types'
import { bumpVersion, computeVersionBump, generateChangelog } from '../../../lib/semver'

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true })
}

async function readLatestRelease(
  slug: string,
): Promise<PublishedRelease | null> {
  const latestPath = path.join(process.cwd(), 'releases', slug, 'latest.json')

  try {
    const raw = await fs.readFile(latestPath, 'utf-8')
    return JSON.parse(raw) as PublishedRelease
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') {
      return null
    }
    throw error
  }
}

export async function POST(request: Request) {
  const role = cookies().get('role')?.value
  if (role !== 'publisher') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  let body: { page?: Page; slug?: string }
  try {
    body = (await request.json()) as { page?: Page; slug?: string }
  } catch (error) {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 500 })
  }

  const page = body.page
  const slug = body.slug

  if (!page || !slug) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 500 })
  }

  try {
    const lastRelease = await readLatestRelease(slug)
    const releasesDir = path.join(process.cwd(), 'releases', slug)
    await ensureDir(releasesDir)

    let bump: 'major' | 'minor' | 'patch' | 'none'
    let newVersion = '1.0.0'

    if (!lastRelease) {
      bump = 'minor'
      newVersion = '1.0.0'
    } else {
      bump = computeVersionBump(lastRelease.page, page)
      if (bump === 'none') {
        return NextResponse.json(
          { message: 'No changes to publish' },
          { status: 200 },
        )
      }
      newVersion = bumpVersion(lastRelease.version || '0.0.0', bump)
    }

    const previousPage = lastRelease?.page || page
    const changelog = generateChangelog(previousPage, page, bump, newVersion)

    const release: PublishedRelease = {
      version: newVersion,
      slug,
      page,
      publishedAt: new Date().toISOString(),
      changelog,
    }

    const versionPath = path.join(releasesDir, `${newVersion}.json`)
    const latestPath = path.join(releasesDir, 'latest.json')
    const payload = JSON.stringify(release, null, 2)

    await fs.writeFile(versionPath, payload, 'utf-8')
    await fs.writeFile(latestPath, payload, 'utf-8')

    return NextResponse.json(
      { version: newVersion, changelog },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ message: 'Publish failed' }, { status: 500 })
  }
}
