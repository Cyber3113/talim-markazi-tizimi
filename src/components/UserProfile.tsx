import { useAuth } from '@/context/AuthContext';

const Profile = () => {
  const { user, tokens } = useAuth();

  if (!user || !tokens?.access) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="mt-4">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Access Token:</strong> {tokens.access}</p>
        <p><strong>Refresh Token:</strong> {tokens.refresh}</p>
      </div>
    </div>
  );
};

export default Profile;