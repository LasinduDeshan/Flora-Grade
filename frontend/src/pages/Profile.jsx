import { useAuthStore } from '../lib/store';
import Button from '../components/ui/Button';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
      username: user?.username || '',
    }
  });

  const onSubmit = (data) => {
    // In a real app, send update to backend
    updateUser({ ...user, ...data });
    toast.success('Profile updated (local only)');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            {...register('full_name', { required: 'Full name is required' })}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${errors.full_name ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.full_name && <p className="text-sm text-red-600 mt-1">{errors.full_name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            {...register('username', { required: 'Username is required' })}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 ${errors.username ? 'border-red-300' : 'border-gray-300'}`}
            disabled
          />
        </div>
        <Button type="submit" className="w-full">Update Profile</Button>
      </form>
    </div>
  );
};

export default Profile; 