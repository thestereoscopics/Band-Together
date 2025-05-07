export default function MembersList({ discogsArtistData }) {
  const inactiveMembers = !discogsArtistData.members.every(
    (member) => member.active
  );
  return (
    <div>
      <h3 className='text-2xl font-semibold text-accent-400'>Members</h3>
      <div className='flex gap-4 align-top'>
        <div className='w-1/2'>
          {inactiveMembers && (
            <p className='text-lg mb-2 underline text-gray-300'>Current</p>
          )}
          <ul>
            {discogsArtistData.members.map(
              (member) =>
                member.active && <li key={member.id}>{member.name}</li>
            )}
          </ul>
        </div>
        <div className='w-1/2'>
          {inactiveMembers && (
            <>
              <p className='text-lg mb-2 underline text-gray-300'>
                Previous Members
              </p>
              <ul>
                {discogsArtistData.members.map(
                  (member) =>
                    !member.active && <li key={member.id}>{member.name}</li>
                )}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
