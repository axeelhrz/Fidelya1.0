'use client';
export const dynamic = 'force-dynamic';


import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useProfile } from '@/hooks/use-profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Camera, 
  Linkedin,
  Loader2, 
  MapPin, 
  Building2, 
  Globe, 
  Twitter, 
  Facebook 
} from 'lucide-react';

export default function ProfilePage() {
  const { profile, isLoading, updateProfile, uploadProfileImage } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    file: File, 
    type: 'avatar' | 'cover'
  ) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      const url = await uploadProfileImage(file, type);
      if (url) {
        toast.success(`${type === 'avatar' ? 'Profile' : 'Cover'} photo updated`);
      }
    } catch (error) {
      toast.error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      await updateProfile({
        displayName: profile.displayName,
        bio: profile.bio,
        location: profile.location,
        company: profile.company,
        website: profile.website,
        socialLinks: profile.socialLinks
      });
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Photo Section */}
      <div className="relative h-[300px] w-full group">
        <Image
          src={profile.coverPhotoUrl}
          alt="Cover"
          className="object-cover rounded-b-xl"
          fill
          priority
        />
        <div className="absolute inset-0 bg-black/20 rounded-b-xl" />
        
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => coverInputRef.current?.click()}
        >
          <Camera className="h-4 w-4" />
        </Button>
        
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file, 'cover');
          }}
        />

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute -bottom-16 left-8"
        >
          <div className="relative group">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
              <AvatarImage src={profile.avatarUrl} />
              <AvatarFallback>
                {profile.displayName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => avatarInputRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
            </Button>
            
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, 'avatar');
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-12 space-y-8">
        {/* Profile Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{profile.displayName}</h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{profile.location}</span>
            </div>
          </div>
          
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            variant={isEditing ? "default" : "outline"}
            disabled={isSaving}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>

        {/* Profile Information */}
        <div className="grid gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and public information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Full Name</Label>
                    <Input
                      id="displayName"
                      value={profile.displayName}
                      disabled={!isEditing}
                      onChange={(e) => updateProfile({ ...profile, displayName: e.target.value })}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={profile.email}
                      disabled
                      type="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      disabled={!isEditing}
                      onChange={(e) => updateProfile({ ...profile, bio: e.target.value })}
                      placeholder="Tell us about yourself"
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          value={profile.location}
                          disabled={!isEditing}
                          onChange={(e) => updateProfile({ ...profile, location: e.target.value })}
                          className="pl-10"
                          placeholder="Your location"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="website"
                          value={profile.website}
                          disabled={!isEditing}
                          onChange={(e) => updateProfile({ ...profile, website: e.target.value })}
                          className="pl-10"
                          placeholder="Your website"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Professional Details</CardTitle>
                  <CardDescription>
                    Your work and professional presence
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        value={profile.company}
                        disabled={!isEditing}
                        onChange={(e) => updateProfile({ ...profile, company: e.target.value })}
                        className="pl-10"
                        placeholder="Your company"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Social Links</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={profile.socialLinks?.linkedin || ''}
                          disabled={!isEditing}
                          onChange={(e) => updateProfile({
                            ...profile,
                            socialLinks: {
                              ...profile.socialLinks,
                              linkedin: e.target.value
                            }
                          })}
                          className="pl-10"
                          placeholder="LinkedIn URL"
                        />
                      </div>

                      <div className="relative">
                        <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={profile.socialLinks?.twitter || ''}
                          disabled={!isEditing}
                          onChange={(e) => updateProfile({
                            ...profile,
                            socialLinks: {
                              ...profile.socialLinks,
                              twitter: e.target.value
                            }
                          })}
                          className="pl-10"
                          placeholder="Twitter URL"
                        />
                      </div>

                      <div className="relative">
                        <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={profile.socialLinks?.facebook || ''}
                          disabled={!isEditing}
                          onChange={(e) => updateProfile({
                            ...profile,
                            socialLinks: {
                              ...profile.socialLinks,
                              facebook: e.target.value
                            }
                          })}
                          className="pl-10"
                          placeholder="Facebook URL"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Activity Overview</CardTitle>
                  <CardDescription>
                    Your activity statistics updated in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center p-6 rounded-xl bg-primary/5"
                    >
                      <p className="text-3xl font-bold text-primary">
                        {profile.statistics.totalClients}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Total Clients
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center p-6 rounded-xl bg-primary/5"
                    >
                      <p className="text-3xl font-bold text-primary">
                        {profile.statistics.activePolicies}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Active Policies
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center p-6 rounded-xl bg-primary/5"
                    >
                      <p className="text-3xl font-bold text-primary">
                        {profile.statistics.successRate}%
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Success Rate
                      </p>
                    </motion.div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Last updated: {new Date(profile.statistics.lastUpdated).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}