export default async function getSpotifyToken() {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENTID;
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENTSECRET;
  const tokenUrl = "https://accounts.spotify.com/api/token";

  if (!clientId || !clientSecret) {
    throw new Error("Spotify client ID or secret is not defined");
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData };
    }

    const data = await response.json();
    return { access_token: data.access_token };
  } catch (error) {
    console.error("Error fetching Spotify token:", error);
    return { error: "Internal Server Error" };
  }
}

export async function getBand(band, service) {
  //probably need to get this by url
  const encodedBand = encodeURIComponent(band);
  try {
    const secret = process.env.NEXT_PUBLIC_DISCOGS_SECRET;
    const key = process.env.NEXT_PUBLIC_DISCOGS_KEY;
    if (service === "discogs") {
      const res = await fetch(
        `https://api.discogs.com/database/search?q=${encodedBand}&artist&key=${key}&secret=${secret}`
      );
      const bandsQuery = await res.json();
      return bandsQuery;
    } else if (service === "musicbrainz") {
      //https://musicbrainz.org/doc/libmusicbrainz
      const res = await fetch(
        `https://musicbrainz.org/ws/2/artist/?query=${encodedBand}&fmt=json&limit=30`
      );
      const bandsQuery = await res.json();
      return bandsQuery;
    } else if (service === "lastfm") {
      const res = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodedBand}&api_key=${process.env.NEXT_PUBLIC_LASTFM_KEY}&format=json`
      );
      const bandsQuery = await res.json();
      return bandsQuery;
    } else if (service === "spotify") {
      //https://developer.spotify.com/documentation/web-api/reference/#category-search
      //https://developer.spotify.com/documentation/general/guides/authorization
      const token = await getSpotifyToken();
      if (token.error || !token.access_token) {
        throw new Error("Could not fetch bands");
      }
      console.log(100);
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodedBand}&type=artist&access_token=${token.access_token}`
      );
      const bandsQuery = await res.json();
      console.log(99, token.access_token);
      return bandsQuery;
    }
  } catch {
    throw new Error("Could not fetch bands");
  }
}
