import { useState, useEffect } from 'react';
import { profileService } from '@/hooks/profile.service';
import { ProfileData } from '@/types/profile';
import { useUser } from './use-user';


export const useProfile = () => {
  const { profile: user } = useUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = profileService.subscribeToProfile(
      user.uid,
      (profile) => {
        setProfile(profile);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const updateProfile = async (data: Partial<ProfileData>) => {
    if (!user?.uid) return;
    try {
      await profileService.updateProfile(user.uid, data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return false;
    }
  };

  const uploadProfileImage = async (
    file: File, 
    type: 'avatar' | 'cover'
  ) => {
    if (!user?.uid) return null;
    try {
      const url = await profileService.uploadImage(user.uid, file, type);
      await updateProfile({
        [type === 'avatar' ? 'avatarUrl' : 'coverPhotoUrl']: url
      });
      return url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      return null;
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    uploadProfileImage
  };
};
