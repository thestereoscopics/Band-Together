"use server";

/**
 * Fetches an array of country objects from the REST Countries API.
 *
 * @returns {Promise<Array<Country>>} An array of objects containing the country name and flag.
 * @throws {Error} If fetching fails.
 */
export async function getCountries() {
  const response = await fetch(
    "https://restcountries.com/v2/all?fields=name,flag"
  );
  const countries = await response.json();
  return countries;
}

/**
 * Fetches a Spotify access token using client credentials flow.
 * @returns {Promise<Object>} An object containing the access token or an error message.
 * @throws Will throw an error if client ID or secret are not defined.
 */
export async function getSpotifyToken() {
  const spotifyClientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const spotifyClientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
  const spotifyTokenUrl = "https://accounts.spotify.com/api/token";

  // Validate that client ID and secret are defined
  if (!spotifyClientId || !spotifyClientSecret) {
    throw new Error("Spotify client ID or secret is not defined");
  }

  // Set up request parameters for the client credentials flow
  const requestParams = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: spotifyClientId,
    client_secret: spotifyClientSecret,
  });

  try {
    // Make a POST request to Spotify's token endpoint
    const response = await fetch(spotifyTokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestParams.toString(),
    });

    // Handle non-successful responses
    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData };
    }

    // Parse and return the access token from the response
    const tokenData = await response.json();
    return { accessToken: tokenData.access_token };
  } catch (error) {
    console.error("Error fetching Spotify token:", error);
    return { error: "Internal Server Error" };
  }
}

/**
 * Searches for bands on the specified service.
 * @param {FormData} formData - A FormData object containing the service name and the search query.
 * @returns {Promise<Object>} An object containing the service name and the search results.
 * @throws Will throw an error if the service is invalid or if fetching fails.
 */
export async function searchBands(formData) {
  const serviceName = "spotify";
  const query = encodeURIComponent(formData.get("search")).slice(0, 100);
  if (!query || !serviceName) {
    return { message: "Please choose a band and a service" };
  }

  // URLs for each service we will only use Spotify for now as their search seems best
  const serviceUrls = {
    discogs: `https://api.discogs.com/database/search?q=${query}&artist&key=${process.env.NEXT_PUBLIC_DISCOGS_KEY}&secret=${process.env.NEXT_PUBLIC_DISCOGS_SECRET}`,
    musicbrainz: `https://musicbrainz.org/ws/2/artist/?query=${query}&fmt=json&limit=30`,
    lastfm: `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${query}&api_key=${process.env.NEXT_PUBLIC_LASTFM_KEY}&format=json`,
    spotify: `https://api.spotify.com/v1/search?q=${query}&type=artist`,
  };

  const serviceUrl = serviceUrls[serviceName];

  if (!serviceUrl) {
    throw new Error("Invalid service");
  }

  try {
    let response;
    if (serviceName === "spotify") {
      const token = await getSpotifyToken();

      if (token.error || !token.accessToken) {
        throw new Error("Could not fetch bands");
      }
      response = await fetch(`${serviceUrl}&access_token=${token.accessToken}`);
    } else {
      response = await fetch(serviceUrl);
    }

    const bandsQuery = await response.json();
    return { serviceName, bandInfo: bandsQuery };
  } catch (error) {
    console.error("Error fetching bands:", error);
    throw new Error("Could not fetch bands");
  }
}

/**
 * Fetches artist information and releases from a specified service.
 * @param {string} serviceName - The name of the service to fetch from ('dc' for Discogs, 'sp' for Spotify).
 * @param {string} artistId - The ID of the artist to fetch.
 * @returns {Promise<Object>} An object containing the service name and artist data, and releases if available.
 * @throws Will throw an error if the service is invalid or if fetching fails.
 */
export async function getArtist(serviceName, artistId, artistName) {
  if (!serviceName || !artistId) {
    return { message: "Band could not be found" };
  }

  // get both - use artistName to search first then get artistID from first option

  try {
    if (serviceName === "dc") {
      const secret = process.env.NEXT_PUBLIC_DISCOGS_SECRET;
      const key = process.env.NEXT_PUBLIC_DISCOGS_KEY;
      const artistResponse = await fetch(
        `https://api.discogs.com/artists/${artistId}?key=${key}&secret=${secret}`
      );
      const releasesResponse = await fetch(
        `https://api.discogs.com/artists/${artistId}/releases?key=${key}&secret=${secret}`
      );

      const artistData = await artistResponse.json();
      const { pagination, releases } = await releasesResponse.json();

      const releaseData = Array.from(
        new Map(releases.map((album) => [album.id, album])).values()
      );

      return {
        serviceName,
        artistData,
        releaseData,
        pagination,
      };
    } else if (serviceName === "sp") {
      const tokenResponse = await getSpotifyToken();
      if (tokenResponse.error || !tokenResponse.accessToken) {
        throw new Error("Could not fetch band");
      }

      const artistResponse = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}?access_token=${tokenResponse.accessToken}`
      );

      const artistData = await artistResponse.json();

      return {
        serviceName,
        artistData,
      };
    } else {
      throw new Error("Invalid service");
    }
  } catch (error) {
    console.error("Error fetching band:", error);
    throw new Error("Could not fetch band");
  }
}

/**
 * Fetches the next page of bands from the specified service.
 * @param {string} nextPageUrl The URL of the next page of bands.
 * @returns {Promise<Object>} The next page of bands.
 */
export async function getNextPage(nextPageUrl) {
  try {
    const response = await fetch(nextPageUrl);
    const nextPageData = await response.json();
    return nextPageData;
  } catch (error) {
    console.error("Error fetching bands:", error);
    throw new Error("Could not fetch bands");
  }
}

export async function setPagination(params) {
  return params;
}
