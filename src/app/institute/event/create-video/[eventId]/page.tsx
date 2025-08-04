'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';
import { Label } from '@radix-ui/react-label';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useState, useEffect, useCallback, KeyboardEvent } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ClipLoader } from 'react-spinners';

function Page() {
  const parseCommaSeparated = (raw: string): string[] => {
    return Array.from(

      raw
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean)
    )
  };
  const router = useRouter();
  const { eventId } = useParams() as { eventId: string };

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [description, setDescription] = useState('');


  const [tagsInput, setTagsInput] = useState('');
  const [categoriesInput, setCategoriesInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTagsCommit = () => {
    setTags(parseCommaSeparated(tagsInput));
    setTagsInput('');
  };

  const handleCategoriesCommit = () => {
    setCategories(parseCommaSeparated(categoriesInput));
    setCategoriesInput('');
  };

  const handleFlyerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));

    }
  };
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoType, setVideoType] = useState<string>('');
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
      const file = e.target.files[0];
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
    }
  }

const handleVideoLoad = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
  const vid = e.currentTarget as HTMLVideoElement;
  const height = vid.videoHeight;
  const width = vid.videoWidth;

  if (height > width) {
    setVideoType("reel");
  } else {
    setVideoType("highlight");
  }
};
  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  const handelSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      let thumbnailUrl = "";
      if (thumbnailFile) {
        thumbnailUrl = await uploadToCloudinary(thumbnailFile);
      }
      let videoUrl = "";
      if (videoFile) {
        videoUrl = await uploadToCloudinary(videoFile);
      }
      const formData = {
        videoUrl,
        eventId,
        thumbnailUrl,
        videoType,
        description,
        tags,
        categories
      }

      const res = await axios.post('/api/events/add-video', formData);
      if (res.status === 201) {
        toast.success("Sub-event created successfully!");

        setTimeout(() => {
          router.push(`/institute/event/${eventId}`);
        }, 1200);

      } else {
        toast.error("Failed to create flyer");
        setLoading(false);
      }
    } catch (error) {
      console.log("Error: ", error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto bg-[#111111] rounded-2xl shadow-lg border border-zinc-800 p-10">
        <div className="mb-5">
          <h1 className="text-3xl font-semibold leading-tight">Add Video For Your Event</h1>
          <p className="text-zinc-400 mt-1">
            Fill in the details below. After creation you’ll be redirected back to the parent event.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>

            <label className=" cursor-pointer bg-[#1f1f2a] px-5 py-3 mb-5 rounded-md text-sm font-medium shadow-sm hover:bg-[#2a2a4a] transition flex items-center justify-center">
              Upload Thumbnail
              <input
                type="file"
                accept="image/*"
                onChange={handleFlyerChange}
                className="hidden"
                required
              />
            </label>

            {thumbnailPreview ? (
              <div className="mt-5 w-full h-[460px] sm:h-[360px] relative rounded-md overflow-hidden border border-zinc-700 bg-[#0f0f17] flex items-center justify-center">
                <img
                  src={thumbnailPreview}
                  alt="preview"
                  className="max-w-full max-h-full object-contain"
                  draggable={false}

                />
              </div>
            ) : (
              <div className="mt-6 pt-5 w-full h-[260px] sm:h-[360px] flex items-center justify-center rounded-md border border-dashed border-zinc-700 bg-[#0f0f17]">
                <span className="text-sm text-zinc-400">
                  No thumbnail selected. Upload to preview.
                </span>
              </div>
            )}
          </div>
          <div>

            <label className=" cursor-pointer bg-[#1f1f2a] px-5 py-3 mb-5 rounded-md text-sm font-medium shadow-sm hover:bg-[#2a2a4a] transition flex items-center justify-center">
              Upload video
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"

                required
              />
            </label>

            {videoPreviewUrl ? (
              <div className="mt-5 w-full h-[460px] sm:h-[360px] relative rounded-md overflow-hidden border border-zinc-700 bg-[#0f0f17] flex flex-col">
                <video
                  src={videoPreviewUrl || undefined}
                  controls
                  className="w-full h-full object-contain rounded-md"
                  draggable={false}
                  onLoadedMetadata={handleVideoLoad}
                />
              </div>
            ) : (
              <div className="mt-6 pt-5 w-full h-[260px] sm:h-[360px] flex items-center justify-center rounded-md border border-dashed border-zinc-700 bg-[#0f0f17]">
                <span className="text-sm text-zinc-400">
                  No video selected. Upload to preview.
                </span>
              </div>
            )}
          </div>

          <div>
            <div className="mb-4">
              <Label className="mb-1">Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
                className="bg-[#111111] text-white border border-zinc-600 placeholder:text-zinc-500"
                required
              />
            </div>

            {/* Tags */}
            <div className="mt-5">
              <Label className="mb-1">Tags</Label>
              <Input
                type="text"
                value={tagsInput}
                required
                onChange={e => setTagsInput(e.target.value)}
                onBlur={handleTagsCommit}
                onKeyDown={(e: KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTagsCommit();
                  }
                }}
                placeholder="music, workshop, networking"
                className="w-full bg-[#111111] text-white border border-zinc-600 rounded px-3 py-2 placeholder:text-zinc-500"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(t => (
                    <div
                      key={t}
                      className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-full text-xs"
                    >
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Categories */}
            <div className="mt-5">
              <Label className="mb-1">Categories</Label>
              <Input
                type="text"
                required
                value={categoriesInput}
                onChange={e => setCategoriesInput(e.target.value)}
                onBlur={handleCategoriesCommit}
                onKeyDown={(e: KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCategoriesCommit();
                  }
                }}
                placeholder="fest, sports, contest"
                className="w-full bg-[#111111] text-white border border-zinc-600 rounded px-3 py-2 placeholder:text-zinc-500"
              />
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map(c => (
                    <div
                      key={c}
                      className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-full text-xs"
                    >
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
        <div className='flex items-center justify-center'>
          <Button className='w-2/3 py-3 bg-[#1111] border border-gray-200 rounded-sm mt-5' onClick={handelSubmit}>
            {
              loading ? (
                <>
                  <ClipLoader size={20} color='#fff' />
                </>) : (<>
                  Submit Flyer
                </>)
            }
          </Button>
        </div>

      </div>
    </div>
  );
}

export default Page;
