import Dislike from '@/app/ui/Dislike'
import React from 'react'

const BlogSlugPage = async ( {params}: {params: Promise<{slug: string}>} ) => {
  const resolvedParams = await params
  return (
    <Dislike blogSlug={resolvedParams.slug} />
  )
}

export default BlogSlugPage