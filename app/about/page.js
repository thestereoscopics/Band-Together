export const revalidate = 86400;
export const metadata = {
  title: "About",
};

export default async function Page() {
  return (
    <>
      <div className='text-foreground px-6 py-16'>
        <div className='max-w-3xl mx-auto space-y-10'>
          <h1 className='text-5xl font-bold text-primary-300'>
            About Band Together
          </h1>
          <p className='text-lg leading-relaxed'>
            Band Together is your private space to track and catalog all your
            favorite bands — without messing up your music recommendations on
            Spotify, Apple Music, or other streaming platform.
          </p>

          <p className='text-lg leading-relaxed'>
            Whether you&apos;re deep into discovering obscure post-punk or just
            keeping tabs on your childhood favorites, Band Together keeps your
            music tastes all in one place.
          </p>

          <div className='border-l-4 border-primary-400 pl-4 text-accent-300 italic'>
            “I didn&apos;t want to mess up my Discover Weekly. I just wanted to
            remember that band I saw open for Big Thief.”
          </div>

          <div className='text-lg'>
            <h2 className='text-2xl font-semibold text-primary-100 mb-2'>
              Features:
            </h2>
            <ul className='list-disc pl-6 space-y-2'>
              <li>Privately favorite bands without platform influence</li>
              <li>Pulls in rich data from Spotify & Discogs</li>
              <li>See albums, songs, bios, pics, and more</li>
              <li>Explore and rediscover the music you love</li>
            </ul>
          </div>

          <div className='text-lg'>
            <h2 className='text-2xl font-semibold text-primary-100 mb-2'>
              Caveats:
            </h2>
            <p className='text-lg leading-relaxed'>
              Band Together is built using APIs from Spotify and Discogs. This
              is both a blessing and a curse. They both are fantastic APIs, but
              offer very different information. When searching, we use Spotify
              for it&apos;s fantastic search functions, but then we try to pair
              the results with Discogs&apos; rich datasets. The issue is band
              names can be spelled differently between platforms due to spaces
              or umlauts or some such thing and band IDs are always different.
              So we have to get results from Discogs then filter them using
              album titles that match between platforms. All that to say,
              sometimes it&apos;s slow. And sometimes it doesn&apos;t pair
              results between the platforms at all. Also, sometimes the band
              isn&apos;t on one service or the other.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
