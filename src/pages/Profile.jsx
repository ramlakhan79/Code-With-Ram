import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera } from 'lucide-react';
import api, { applyServerErrors, getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Field from '../components/ui/Field';
import Avatar from '../components/ui/Avatar';

const url = z.union([z.literal(''), z.string().trim().url('Enter a full address starting with https://')]);
const schema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(80),
  bio: z.string().trim().max(500, 'Keep it under 500 characters'),
  location: z.string().trim().max(100),
  website: url, githubUrl: url, linkedinUrl: url,
  skills: z.string().max(600),
});

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, setError, formState: { errors, isSubmitting, isDirty }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...user, skills: user.skills.join(', ') },
  });

  const onSubmit = async (values) => {
    const skills = [...new Set(values.skills.split(',').map((s) => s.trim()).filter(Boolean))];
    try {
      const res = await api.patch('/users/me', { ...values, skills });
      setUser(res.data.data.user);
      reset({ ...res.data.data.user, skills: res.data.data.user.skills.join(', ') });
      toast.success('Profile saved');
    } catch (err) {
      if (!applyServerErrors(err, setError)) toast.error(getErrorMessage(err));
    }
  };

  const onAvatar = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return toast.error('Use a JPEG, PNG or WebP image.');
    if (file.size > 2 * 1024 * 1024) return toast.error('Image must be 2 MB or smaller.');
    const form = new FormData();
    form.append('avatar', file);
    setUploading(true);
    try {
      const res = await api.post('/users/me/avatar', form);
      setUser(res.data.data.user);
      toast.success('Photo updated');
    } catch (err) { toast.error(getErrorMessage(err)); } finally { setUploading(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="mt-1 text-sm text-muted">This is what other developers see at <Link className="underline" to={`/users/${user.username}`}>/users/{user.username}</Link>.</p>

      <div className="mt-6 flex items-center gap-4">
        <Avatar user={user} size={72} />
        <div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onAvatar} aria-label="Upload profile photo" />
          <Button variant="secondary" size="sm" loading={uploading} onClick={() => fileRef.current?.click()}><Camera className="h-4 w-4" aria-hidden /> Change photo</Button>
          <p className="mt-1.5 text-xs text-muted">JPEG, PNG or WebP, up to 2 MB.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4 sm:grid-cols-2" noValidate>
        <Field className="sm:col-span-2" label="Full name" error={errors.name?.message} {...register('name')} />
        <Field className="sm:col-span-2" as="textarea" rows={4} label="Bio" error={errors.bio?.message} {...register('bio')} />
        <Field label="Location" error={errors.location?.message} {...register('location')} />
        <Field label="Website" placeholder="https://" error={errors.website?.message} {...register('website')} />
        <Field label="GitHub" placeholder="https://github.com/you" error={errors.githubUrl?.message} {...register('githubUrl')} />
        <Field label="LinkedIn" placeholder="https://linkedin.com/in/you" error={errors.linkedinUrl?.message} {...register('linkedinUrl')} />
        <Field className="sm:col-span-2" label="Skills" hint="Separate with commas, for example React, Node.js, SQL." error={errors.skills?.message} {...register('skills')} />
        <div className="sm:col-span-2"><Button type="submit" loading={isSubmitting} disabled={!isDirty}>Save changes</Button></div>
      </form>
    </div>
  );
}
