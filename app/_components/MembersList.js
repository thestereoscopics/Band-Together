export default function MembersList({ discogsArtistData }) {
  return (
    <div>
      <h3 className='text-xl font-semibold mb-2 text-gray-800'>Members</h3>
      <ul>
        {discogsArtistData.members.map((member) => (
          <li key={member.id}>
            {member.name} -
            <span>current member: {member.active ? "true" : "false"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
