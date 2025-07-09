import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.accessToken) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      params: {
        limit: 50,
      },
    })

    res.status(200).json(response.data)
  } catch (error) {
    console.error('Error fetching Spotify playlists:', error)
    
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return res.status(401).json({ message: 'Spotify token expired' })
    }

    res.status(500).json({ 
      message: 'Failed to fetch playlists',
      error: axios.isAxiosError(error) ? error.response?.data : String(error)
    })
  }
}
