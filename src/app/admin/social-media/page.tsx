'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { InstagramIcon, YouTubeIcon, FacebookIcon, TwitterXIcon } from '@/components/social-links';
import { getSocialMediaSettings, updateSocialMediaSettings } from '@/app/actions/social-media';
import { Share2, CheckCircle2, AlertCircle, Save, Loader2, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function SocialMediaSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [instagramUrl, setInstagramUrl] = useState('');
  const [instagramActive, setInstagramActive] = useState(true);

  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeActive, setYoutubeActive] = useState(true);

  const [facebookUrl, setFacebookUrl] = useState('');
  const [facebookActive, setFacebookActive] = useState(true);

  const [twitterUrl, setTwitterUrl] = useState('');
  const [twitterActive, setTwitterActive] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getSocialMediaSettings();
      if (res.success && res.data) {
        setInstagramUrl(res.data.instagram?.url || '');
        setInstagramActive(res.data.instagram?.active ?? true);

        setYoutubeUrl(res.data.youtube?.url || '');
        setYoutubeActive(res.data.youtube?.active ?? true);

        setFacebookUrl(res.data.facebook?.url || '');
        setFacebookActive(res.data.facebook?.active ?? true);

        setTwitterUrl(res.data.twitter?.url || '');
        setTwitterActive(res.data.twitter?.active ?? true);
      }
      setLoading(false);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const res = await updateSocialMediaSettings(
      {
        instagram: {
          url: instagramUrl,
          active: instagramActive,
        },
        youtube: {
          url: youtubeUrl,
          active: youtubeActive,
        },
        facebook: {
          url: facebookUrl,
          active: facebookActive,
        },
        twitter: {
          url: twitterUrl,
          active: twitterActive,
        },
      },
      user?.name || user?.email || 'admin'
    );

    if (res.success) {
      toast({
        title: 'Success',
        description: res.message, // "Social media settings updated." (Rule 23)
      });
    } else {
      if (res.errors) {
        setErrors(res.errors);
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: res.message || 'Please fix the URL errors.',
      });
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
            <Share2 className="h-4 w-4" />
            <span>Site Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Social Media Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure official social profiles across IDL Education (Header, Mobile Menu &amp; Footer).
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Instagram Card */}
        <Card className="border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden dark:border-slate-800">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E4405F]/10 text-[#E4405F] flex items-center justify-center shrink-0 border border-[#E4405F]/20">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Instagram</CardTitle>
                  <CardDescription className="text-xs">
                    Official handle profile URL (e.g. https://www.instagram.com/idleducation)
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="instagram-active" className="text-xs font-semibold cursor-pointer">
                  {instagramActive ? (
                    <span className="text-emerald-600 font-bold">Active</span>
                  ) : (
                    <span className="text-slate-400">Disabled</span>
                  )}
                </Label>
                <Switch
                  id="instagram-active"
                  checked={instagramActive}
                  onCheckedChange={setInstagramActive}
                  disabled={loading || saving}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            <div className="space-y-1.5">
              <Label htmlFor="instagram-url" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Profile URL
              </Label>
              <div className="relative">
                <Input
                  id="instagram-url"
                  type="url"
                  placeholder="https://www.instagram.com/idleducation"
                  value={instagramUrl}
                  onChange={(e) => {
                    setInstagramUrl(e.target.value);
                    if (errors.instagram) {
                      setErrors((prev) => ({ ...prev, instagram: '' }));
                    }
                  }}
                  disabled={loading || saving}
                  className={errors.instagram ? 'border-red-500 focus-visible:ring-red-400 pr-9' : 'pr-9'}
                />
                {instagramUrl && !errors.instagram && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors p-1"
                    title="Open URL in new tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
              {errors.instagram ? (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.instagram}</span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">Domain must be instagram.com</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* YouTube Card */}
        <Card className="border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden dark:border-slate-800">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF0000]/10 text-[#FF0000] flex items-center justify-center shrink-0 border border-[#FF0000]/20">
                  <YouTubeIcon className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">YouTube</CardTitle>
                  <CardDescription className="text-xs">
                    Official channel URL (e.g. https://www.youtube.com/@idleducation)
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="youtube-active" className="text-xs font-semibold cursor-pointer">
                  {youtubeActive ? (
                    <span className="text-emerald-600 font-bold">Active</span>
                  ) : (
                    <span className="text-slate-400">Disabled</span>
                  )}
                </Label>
                <Switch
                  id="youtube-active"
                  checked={youtubeActive}
                  onCheckedChange={setYoutubeActive}
                  disabled={loading || saving}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            <div className="space-y-1.5">
              <Label htmlFor="youtube-url" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Channel URL
              </Label>
              <div className="relative">
                <Input
                  id="youtube-url"
                  type="url"
                  placeholder="https://www.youtube.com/@idleducation"
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    if (errors.youtube) {
                      setErrors((prev) => ({ ...prev, youtube: '' }));
                    }
                  }}
                  disabled={loading || saving}
                  className={errors.youtube ? 'border-red-500 focus-visible:ring-red-400 pr-9' : 'pr-9'}
                />
                {youtubeUrl && !errors.youtube && (
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors p-1"
                    title="Open URL in new tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
              {errors.youtube ? (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.youtube}</span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">Domain must be youtube.com or youtu.be</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Facebook Card */}
        <Card className="border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden dark:border-slate-800">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center shrink-0 border border-[#1877F2]/20">
                  <FacebookIcon className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Facebook</CardTitle>
                  <CardDescription className="text-xs">
                    Official page URL (e.g. https://www.facebook.com/idleducation)
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="facebook-active" className="text-xs font-semibold cursor-pointer">
                  {facebookActive ? (
                    <span className="text-emerald-600 font-bold">Active</span>
                  ) : (
                    <span className="text-slate-400">Disabled</span>
                  )}
                </Label>
                <Switch
                  id="facebook-active"
                  checked={facebookActive}
                  onCheckedChange={setFacebookActive}
                  disabled={loading || saving}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            <div className="space-y-1.5">
              <Label htmlFor="facebook-url" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Page URL
              </Label>
              <div className="relative">
                <Input
                  id="facebook-url"
                  type="url"
                  placeholder="https://www.facebook.com/idleducation"
                  value={facebookUrl}
                  onChange={(e) => {
                    setFacebookUrl(e.target.value);
                    if (errors.facebook) {
                      setErrors((prev) => ({ ...prev, facebook: '' }));
                    }
                  }}
                  disabled={loading || saving}
                  className={errors.facebook ? 'border-red-500 focus-visible:ring-red-400 pr-9' : 'pr-9'}
                />
                {facebookUrl && !errors.facebook && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors p-1"
                    title="Open URL in new tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
              {errors.facebook ? (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.facebook}</span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">Domain must be facebook.com</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Twitter / X Card (Footer only) */}
        <Card className="border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden dark:border-slate-800">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                  <TwitterXIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">X (formerly Twitter)</CardTitle>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">Footer Only</span>
                  </div>
                  <CardDescription className="text-xs">
                    Official profile URL (e.g. https://x.com/idleducation)
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="twitter-active" className="text-xs font-semibold cursor-pointer">
                  {twitterActive ? (
                    <span className="text-emerald-600 font-bold">Active</span>
                  ) : (
                    <span className="text-slate-400">Disabled</span>
                  )}
                </Label>
                <Switch
                  id="twitter-active"
                  checked={twitterActive}
                  onCheckedChange={setTwitterActive}
                  disabled={loading || saving}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            <div className="space-y-1.5">
              <Label htmlFor="twitter-url" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Profile URL
              </Label>
              <div className="relative">
                <Input
                  id="twitter-url"
                  type="url"
                  placeholder="https://x.com/idleducation"
                  value={twitterUrl}
                  onChange={(e) => {
                    setTwitterUrl(e.target.value);
                    if (errors.twitter) {
                      setErrors((prev) => ({ ...prev, twitter: '' }));
                    }
                  }}
                  disabled={loading || saving}
                  className={errors.twitter ? 'border-red-500 focus-visible:ring-red-400 pr-9' : 'pr-9'}
                />
                {twitterUrl && !errors.twitter && (
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors p-1"
                    title="Open URL in new tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
              {errors.twitter ? (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.twitter}</span>
                </p>
              ) : (
                <p className="text-[11px] text-slate-400">Domain must be x.com or twitter.com</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-400">
            Changes will take effect immediately across Header, Mobile Menu &amp; Footer.
          </p>
          <Button
            type="submit"
            disabled={loading || saving}
            className="font-bold gap-2 px-6 h-11 shadow-md bg-primary hover:bg-primary/90"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
