import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { google } from 'googleapis'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { title, description, privacyStatus } = req.body

  if (!title) {
    return res.status(400).json({ message: 'Title is required' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.accessToken || session.provider !== 'google') {
      return res.status(401).json({ message: 'YouTube authentication required' })
    }

    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: session.accessToken,
    })

    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    })

    const response = await youtube.playlists.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description: description || 'Converted from Spotify playlist',
        },
        status: {
          privacyStatus: privacyStatus || 'private',
        },
      },
    })

    res.status(200).json(response.data)
  } catch (error) {
    console.error('Error creating YouTube playlist:', error)
    
    res.status(500).json({ 
      message: 'Failed to create YouTube playlist',
      error: String(error)
    })
  }
}
