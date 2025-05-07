"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
// import { get } from "http";
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

  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("auth_id", session.user.id)
    .select();

  if (error) throw new Error("User could not be updated");
  if (!data) throw new Error("User could not be updated");

  revalidatePath("/account/profile");
}

export async function createUser({ email, fullName, vanityName, auth_id }) {
  try {
    const { data, error } = await supabase.from("users").upsert(
      [
        {
          email,
          fullName,
          vanityName,
          auth_id,
        },
      ],
      { onConflict: ["auth_id"] } // Prevents duplicates based on email
    );

    if (error) {
      console.error("User creation error:", error);
      throw new Error("User could not be created");
    }
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

function getUniqueDecades(releases) {
  const decades = new Set();

  releases.forEach((release) => {
    const year = release.year;
    if (year >= 1880 && year < 2030) {
      const decadeStart = Math.floor(year / 10) * 10;
      decades.add(`${decadeStart}s`);
    }
  });

  const uniqueDecades = Array.from(decades);
  return uniqueDecades;
}

async function getUserAuthId() {
  const session = await auth();
  if (!session) throw new Error("User must be logged in");
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", session.user.id)
    .single();
  return user.id;
}

async function getFavoriteList() {
  const userId = await getUserAuthId();

  const { data } = await supabase
    .from("user_likes")
    .select("*")
    .eq("user_id", userId);

  return data;
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
  const serviceUrl = serviceUrls["spotify"];

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

    const favoritesList = await getFavoriteList();
    const bandQuery = await response.json();
    return { bandQuery, favoritesList };
  } catch (error) {
    console.error("Error fetching bands:", error);
    throw new Error("Could not fetch bands");
  }
}

export async function searchBands(query) {
  const serviceName = "spotify";
  const encodedQuery = encodeURIComponent(query).slice(0, 100);

  if (!encodedQuery || !serviceName) {
    return { message: "Please choose a band and a service" };
  }

  const { bandQuery, favoritesList } = await getBands(
    encodedQuery,
    serviceName
  );
  return {
    serviceName,
    bandQuery,
    favoritesList,
  };
}

async function getSpotifyArtistAlbums(spotifyArtistId, accessToken) {
  const response = await fetch(
    `https://api.spotify.com/v1/artists/${spotifyArtistId}/albums?limit=50&include_groups=album`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const data = await response.json();
  return data.items.map((album) => album.name.toLowerCase());
}

// async function findDiscogsArtist(artistName, spotifyAlbums) {
//   // Step 1: Search Discogs for the artist by name
//   const response = await fetch(
//     `https://api.discogs.com/database/search?q=${artistName}&artist&key=${discogsKey}&secret=${discogsSecret}`
//   );
//   const data = await response.json();

//   if (!data.results.length) return null; // No matches found

//   // Step 2: Fetch releases for each potential Discogs artist
//   let counter = 0;
//   for (const artist of data.results) {
//     counter++;
//     const releasesResponse = await fetch(
//       `https://api.discogs.com/artists/${artist.id}/releases?key=${discogsKey}&secret=${discogsSecret}`
//     );
//     const releasesData = await releasesResponse.json();

//     // Normalize Discogs album names
//     const discogsAlbums = releasesData?.releases?.map((release) =>
//       release.title.toLowerCase()
//     );

//     // Step 3: Check for overlapping albums
//     const matchingAlbums = spotifyAlbums.filter((album) =>
//       discogsAlbums?.includes(album)
//     );

//     if (matchingAlbums.length > 0) {
//       console.log(
//         `Match found: ${artist.title} with ${matchingAlbums.length} matching albums with ${counter} calls`
//       );
//       return artist.id; // Return the first artist with album matches
//     }
//   }

//   return null; // No strong match found
// }

async function findDiscogsArtist(artistName, spotifyAlbums) {
  const response = await fetch(
    `https://api.discogs.com/database/search?q=${artistName}&artist&key=${discogsKey}&secret=${discogsSecret}`
  );
  const data = await response.json();

  if (!data.results.length) return null;
  console.log(data);
  console.log(spotifyAlbums);
  // Limit number of artists to avoid rate limiting
  const limitedResults = data.results.slice(0, 10); // Adjust if needed

  // Fire off all artist release fetches in parallel
  const fetches = limitedResults.map(async (artist, index) => {
    try {
      const res = await fetch(
        `https://api.discogs.com/artists/${artist.id}/releases?key=${discogsKey}&secret=${discogsSecret}`
      );
      const releasesData = await res.json();
      if (index === 0) {
        console.log(releasesData);
      }

      const discogsAlbums = releasesData?.releases?.map((release) =>
        release.title.toLowerCase()
      );

      const matchingAlbums = spotifyAlbums.filter((album) =>
        discogsAlbums?.includes(album)
      );

      if (matchingAlbums.length > 0) {
        return {
          id: artist.id,
          title: artist.title,
          matches: matchingAlbums.length,
        };
      }

      return null;
    } catch (err) {
      console.error(`Error fetching releases for artist ${artist.id}:`, err);
      return null;
    }
  });

  const results = await Promise.all(fetches);
  const match = results.find((r) => r !== null);

  if (match) {
    console.log(
      `Match found: ${match.title} with ${match.matches} matching albums`
    );
    return match.id;
  }

  return null;
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

    const { data: savedBand, error: savedBandError } = await supabase
      .from("bands")
      .select("*")
      .eq("id", artistId)
      .single();

    if (savedBandError && savedBandError.code !== "PGRST116") {
      console.error("Band creation error:", savedBandError);
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    let discogsArtistId = "";

    if (
      savedBand &&
      savedBand.discogs_id &&
      savedBand.updated_at &&
      new Date(savedBand.updated_at) > thirtyDaysAgo
    ) {
      console.log("Using saved Discogs ID");
      discogsArtistId = savedBand.discogs_id;
    } else {
      console.log("no saved Discogs ID");
      discogsArtistId = await findDiscogsArtist(
        decodeArtistName,
        spotifyAlbums
      );
    }

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
    const decades = releases?.length > 0 ? getUniqueDecades(releases) : [];

    if (
      !savedBandError ||
      (savedBandError && savedBandError.code === "PGRST116")
    ) {
      const bandInfo = {
        id: artistId,
        artistName: artistName,
        image:
          spotifyArtistData.images.length > 1
            ? spotifyArtistData.images[1].url
            : placeholder.src,
        discogs_id: discogsArtistData.id,
        decades: decades,
        spotify_data: {
          spotify: spotifyArtistData,
        },
        discogs_data: {
          discogs: discogsArtistData,
        },
      };
      const { error: bandError } = await supabase
        .from("bands")
        .upsert([bandInfo], { onConflict: ["id"] });

      if (bandError) {
        console.error("Band creation error:", bandError);
      }
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

export async function saveFavoriteBand({ bandData, isFavoriteButton }) {
  const session = await auth();
  if (!session) throw new Error("User must be logged in");

  const userId = await getUserAuthId();

  if (!userId) throw new Error("Could not find user");

  try {
    const { error: bandError } = await supabase.from("bands").upsert(
      [
        {
          id: bandData.id,
          artistName: bandData.name,
          image: bandData.image,
        },
      ],
      { onConflict: ["id"] }
    );

    if (isFavoriteButton) {
      const { error: likeError } = await supabase
        .from("user_likes")
        .upsert([{ user_id: userId, band_id: bandData.id }], {
          onConflict: ["user_id", "band_id"],
        });

      if (likeError) {
        console.error("Upsert like failed:", likeError);
        throw new Error("Could not like band");
      }
    } else {
      const { error: deleteError } = await supabase
        .from("user_likes")
        .delete({ returning: "minimal" })
        .eq("user_id", userId)
        .eq("band_id", bandData.id);

      if (deleteError) {
        console.error("Delete like failed:", deleteError);
        throw new Error("Could not remove like");
      }
    }
    return "success";
  } catch (error) {
    console.error("Error saving favorite band:", error);
    throw new Error("Could not save favorite band");
  }
}

export async function getFavorite(bandId) {
  const session = await auth();
  if (!session) throw new Error("User must be logged in");

  const userId = await getUserAuthId();
  if (!userId) throw new Error("Could not find user");

  const { data } = await supabase
    .from("user_likes")
    .select("id")
    .eq("user_id", userId)
    .eq("band_id", bandId)
    .single();

  return data;
}

export async function getLikedBands() {
  const session = await auth();
  if (!session) throw new Error("User must be logged in");

  const userId = await getUserAuthId();
  if (!userId) throw new Error("Could not find user");

  const favoritesList = await getFavoriteList();

  const { data: bandsData } = await supabase
    .from("bands")
    .select("*")
    .in(
      "id",
      favoritesList.map((band) => band.band_id)
    );

  return bandsData;
}
