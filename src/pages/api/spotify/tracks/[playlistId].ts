import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { playlistId } = req.query

  if (!playlistId || typeof playlistId !== 'string') {
    return res.status(400).json({ message: 'Playlist ID is required' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.accessToken) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        params: {
          limit: 50,
          fields: 'items(track(id,name,artists(name),album(name,images),duration_ms,external_urls))',
        },
      }
    )

    res.status(200).json(response.data)
  } catch (error) {
    console.error('Error fetching playlist tracks:', error)
    
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return res.status(401).json({ message: 'Spotify token expired' })
    }

    res.status(500).json({ 
      message: 'Failed to fetch playlist tracks',
      error: axios.isAxiosError(error) ? error.response?.data : String(error)
    })
  }
}
