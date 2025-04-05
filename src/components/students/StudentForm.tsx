
import React, { useState, useEffect } from 'react';
import { Student, StudentFormData, Group } from '@/lib/types';
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
import { useToast } from '@/components/ui/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_GROUPS } from '@/lib/authUtils';

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
  groupId?: string; // Optional groupId when adding a student to a specific group
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSubmit, onCancel, groupId }) => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  
  const [formData, setFormData] = useState<StudentFormData>({
    name: student?.name || '',
    userId: student?.userId || undefined,
    address: student?.address || '',
    phone: student?.phone || '',
    parentPhone: student?.parentPhone || '',
    age: student?.age || undefined,
    groupId: groupId || student?.groupId || '',
    username: student?.username || '',
    password: student?.password || '',
  });

  const [errors, setErrors] = useState({
    name: '',
    groupId: '',
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name ? '' : 'Student name is required',
      groupId: formData.groupId ? '' : 'Please select a group',
      username: formData.username ? '' : 'Username is required',
      password: !student && !formData.password ? 'Password is required for new students' : '',
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      
      toast({
        title: student ? "Student updated" : "Student added",
        description: `${formData.name} has been ${student ? 'updated' : 'added'} successfully.`,
      });
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{student ? 'Edit Student' : 'Add New Student'}</CardTitle>
          <CardDescription>
            {student 
              ? 'Update the student information' 
              : 'Enter the details of the new student'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Student Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student full name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username || ''}
              onChange={handleChange}
              placeholder="Enter username for login"
              className={errors.username ? 'border-red-500' : ''}
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">
              {student ? 'Password (leave empty to keep current)' : 'Password'}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password || ''}
              onChange={handleChange}
              placeholder={student ? "Leave empty to keep current password" : "Enter password"}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData.age || ''}
              onChange={handleChange}
              placeholder="Enter student age"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              placeholder="Enter student address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="Enter student phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentPhone">Parent's Phone Number</Label>
            <Input
              id="parentPhone"
              name="parentPhone"
              value={formData.parentPhone || ''}
              onChange={handleChange}
              placeholder="Enter parent's phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupId">Group</Label>
            <Select
              value={formData.groupId}
              onValueChange={(value) => handleSelectChange(value, 'groupId')}
            >
              <SelectTrigger className={errors.groupId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name} {group.price ? `(${group.price})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.groupId && <p className="text-sm text-red-500">{errors.groupId}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="userId">
              User ID (Optional - for linking to an existing user account)
            </Label>
            <Input
              id="userId"
              name="userId"
              value={formData.userId || ''}
              onChange={handleChange}
              placeholder="User ID if available"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {student ? 'Update Student' : 'Add Student'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StudentForm;
