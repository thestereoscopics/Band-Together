"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
// import { redirect } from "next/navigation";

const discogsSecret = process.env.NEXT_PUBLIC_DISCOGS_SECRET;
const discogsKey = process.env.NEXT_PUBLIC_DISCOGS_KEY;

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateUser(formData) {
  const session = await auth();
  if (!session) throw new Error("User must be logged in");

  const vanityName = formData.get("vanityName").slice(0, 100);

  const updateData = { vanityName };
  console.log("session.user.userId :", session.user.userId);
  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", session.user.userId);

  if (!data) throw new Error("User could not be updated");
  if (error) throw new Error("User could not be updated");

  revalidatePath("/account/profile");
}

export async function createUser({ email, fullName, vanityName }) {
  try {
    const { data, error } = await supabase.from("users").upsert(
      [
        {
          email,
          fullName,
          vanityName,
        },
      ],
      { onConflict: ["email"] } // Prevents duplicates based on email
    );

    if (error) {
      console.error("User creation error:", error);
      throw new Error("User could not be created");
    }

    console.log("User created or updated in database:", data);
    return data;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw new Error("User creation failed");
  }
}

export async function getUser(email) {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}

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

async function getBands(query, serviceName) {
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

    return await response.json();
  } catch (error) {
    console.error("Error fetching bands:", error);
    throw new Error("Could not fetch bands");
  }
}

export async function searchBands(formData) {
  const serviceName = "spotify";
  const query = encodeURIComponent(formData.get("search")).slice(0, 100);
  if (!query || !serviceName) {
    return { message: "Please choose a band and a service" };
  }
  const bandsQuery = await getBands(query, serviceName);
  return { serviceName, bandInfo: bandsQuery };
}

async function getSpotifyArtistAlbums(spotifyArtistId, accessToken) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${spotifyArtistId}/albums?include_groups=album,single`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const data = await response.json();
  return data.items.map((album) => album.name.toLowerCase());
}

async function findDiscogsArtist(artistName, spotifyAlbums) {
  // Step 1: Search Discogs for the artist by name
  const response = await fetch(
    `https://api.discogs.com/database/search?q=${artistName}&artist&key=${discogsKey}&secret=${discogsSecret}`
  );
  const data = await response.json();

  if (!data.results.length) return null; // No matches found

  // Step 2: Fetch releases for each potential Discogs artist
  let counter = 0;
  for (const artist of data.results) {
    counter++;
    const releasesResponse = await fetch(
      `https://api.discogs.com/artists/${artist.id}/releases?key=${discogsKey}&secret=${discogsSecret}`
    );
    const releasesData = await releasesResponse.json();

    // Normalize Discogs album names
    const discogsAlbums = releasesData?.releases?.map((release) =>
      release.title.toLowerCase()
    );

    // Step 3: Check for overlapping albums
    const matchingAlbums = spotifyAlbums.filter((album) =>
      discogsAlbums?.includes(album)
    );

    if (matchingAlbums.length > 0) {
      console.log(
        `Match found: ${artist.title} with ${matchingAlbums.length} matching albums with ${counter} calls`
      );
      return artist.id; // Return the first artist with album matches
    }
  }

  return null; // No strong match found
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
  const decodeArtistName = decodeURIComponent(artistName);

  try {
    const tokenResponse = await getSpotifyToken();

    if (tokenResponse.error || !tokenResponse.accessToken) {
      throw new Error("Could not fetch band");
    }
    const spotifyAlbums = await getSpotifyArtistAlbums(
      artistId,
      tokenResponse.accessToken
    );

    const discogsArtistId = await findDiscogsArtist(
      decodeArtistName,
      spotifyAlbums
    );

    const [discogsArtistResponse, discogsReleasesResponse, spotifyResponse] =
      await Promise.all([
        fetch(
          `https://api.discogs.com/artists/${discogsArtistId}?key=${discogsKey}&secret=${discogsSecret}`
        ),
        fetch(
          `https://api.discogs.com/artists/${discogsArtistId}/releases?key=${discogsKey}&secret=${discogsSecret}`
        ),
        fetch(
          `https://api.spotify.com/v1/artists/${artistId}?access_token=${tokenResponse.accessToken}`
        ),
      ]);

    let [discogsArtistData, { pagination, releases }, spotifyArtistData] =
      await Promise.all([
        discogsArtistResponse.json(),
        discogsReleasesResponse.json(),
        spotifyResponse.json(),
      ]);

    if (releases?.length) {
      releases = Array.from(
        new Map(releases.map((album) => [album.id, album])).values()
      );
    }
    return {
      spotifyArtistData,
      discogsArtistData,
      releases,
      pagination,
      spotifyAlbums,
    };
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
  return await params;
}

// ex: "https://api.discogs.com/masters/3590696";

export async function getDiscogsAlbum(albumId) {
  try {
    const albumResponse = await fetch(
      `https://api.discogs.com/masters/${albumId}?key=${discogsKey}&secret=${discogsSecret}`
    );
    const albumData = await albumResponse.json();
    return { albumData };
  } catch (error) {
    console.error("Error fetching album:", error);
    throw new Error("Could not fetch album");
  }
}

export async function saveFavoriteBand(bandDatas) {
  const session = await auth();
  if (!session) throw new Error("User must be logged in");
  try {
    console.log(bandDatas);
    const bandData = {
      id: "spotify_artist_id",
      discogs_id: "discogs_artist_id",
      name: "Artist Name",
      image: "image_url",
      genres: ["rock", "alternative", "pop"],
      decades: ["1990s", "2000s"],
      spotifyData: {
        /* original spotify data */
      },
      discogsData: {
        /* original discogs data */
      },
    };
    // const response = await fetch("/api/favorites", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(bandData),
    // });
    console.log(bandData);

    if (!response.ok) {
      throw new Error("Failed to save favorite band");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving favorite band:", error);
    throw new Error("Could not save favorite band");
  }
}
