
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'CEO':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Mentor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Admin':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Student':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-20 w-20">
            <AvatarImage 
              src={`https://ui-avatars.com/api/?name=${user.name}&background=random&size=80`} 
              alt={user.name} 
            />
            <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          
          <div className="space-y-1 text-center">
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <div className="flex justify-center">
              <Badge className={`${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
