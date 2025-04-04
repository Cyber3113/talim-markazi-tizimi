
import React, { useState } from 'react';
import { User, UserRole } from '@/lib/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MentorFormProps {
  mentor?: User;
  onSubmit: (mentor: User) => void;
  onCancel: () => void;
}

const MentorForm: React.FC<MentorFormProps> = ({ mentor, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: mentor?.name || '',
    username: mentor?.username || '',
    password: '', // We'll include password for new mentors
    role: 'Mentor' as UserRole,
  });

  const [errors, setErrors] = useState({
    name: '',
    username: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors = {
      name: formData.name ? '' : 'Mentor name is required',
      username: formData.username ? '' : 'Username is required',
      password: !mentor && !formData.password ? 'Password is required for new mentors' : '',
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        id: mentor?.id || '',
        ...formData,
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{mentor ? 'Edit Mentor' : 'Create New Mentor'}</CardTitle>
          <CardDescription>
            {mentor 
              ? 'Update the mentor information below' 
              : 'Fill in the details to create a new mentor'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter mentor's full name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className={errors.username ? 'border-red-500' : ''}
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
          </div>
          
          {!mentor && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {mentor ? 'Update Mentor' : 'Create Mentor'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MentorForm;
