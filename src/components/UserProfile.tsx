
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User } from 'lucide-react';

const UserProfile = () => {
  const { user, tokens } = useAuth();

  if (!user || !tokens?.access) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <User size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">Please log in to view your profile.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{user.username}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Shield className="h-3.5 w-3.5 mr-1" />
                <span>{user.role}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">User information</p>
            <div className="grid grid-cols-[1fr_2fr] gap-2">
              <div className="font-medium">Username:</div>
              <div>{user.username}</div>
              <div className="font-medium">Role:</div>
              <div>{user.role}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
