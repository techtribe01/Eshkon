import { NextResponse } from 'next/server'

import { getPage } from '../../../lib/contentfulClient'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }

  try {
    const page = await getPage(slug)
    return NextResponse.json({ page }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 })
  }
}
