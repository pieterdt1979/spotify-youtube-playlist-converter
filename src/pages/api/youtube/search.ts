import { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { query } = req.query

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'Search query is required' })
  }

  try {
    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY,
    })

    const response = await youtube.search.list({
      part: ['snippet'],
      q: query,
      type: ['video'],
      maxResults: 5,
      videoCategoryId: '10', // Music category
      order: 'relevance',
    })

    res.status(200).json(response.data)
  } catch (error) {
    console.error('Error searching YouTube:', error)
    
    res.status(500).json({ 
      message: 'Failed to search YouTube',
      error: String(error)
    })
  }
}
