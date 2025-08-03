'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import React, { useState, useEffect, useCallback, KeyboardEvent } from 'react';

function Page() {
  const parseCommaSeparated = (raw: string): string[] => {
    return Array.from(
      new Set(
        raw
          .split(',')
          .map(s => s.trim().toLowerCase())
          .filter(Boolean)
      )
    );
  };

  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  type Orientation = 'portrait' | 'landscape' | null;
  type DisplayType = 'scroll' | 'advertisement' | null;
  const [orientation, setOrientation] = useState<Orientation>(null);
  const [displayType, setDisplayType] = useState<DisplayType>(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const [tagsInput, setTagsInput] = useState('');
  const [categoriesInput, setCategoriesInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

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
      if (flyerPreview) URL.revokeObjectURL(flyerPreview);
      const file = e.target.files[0];
      setFlyerFile(file);
      setFlyerPreview(URL.createObjectURL(file));
      setOrientation(null);
    }
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    setHeight(img.naturalHeight);
    setWidth(img.naturalWidth);
    if (img.naturalHeight > img.naturalWidth) {
      setOrientation('portrait');
      setDisplayType('scroll');
    } else {
      setOrientation('landscape');
      setDisplayType('advertisement');
    }
  }, []);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (flyerPreview) URL.revokeObjectURL(flyerPreview);
    };
  }, [flyerPreview]);

  return (
    <div className="min-h-screen bg-[#111111] text-white py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto bg-[#111111] rounded-2xl shadow-lg border border-zinc-800 p-10">
        <div className="mb-5">
          <h1 className="text-3xl font-semibold leading-tight">Add Flyers For Your Event</h1>
          <p className="text-zinc-400 mt-1">
            Fill in the details below. After creation you’ll be redirected back to the parent event.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Flyer upload & preview */}
          <div>
           
            <label className=" cursor-pointer bg-[#1f1f2a] px-5 py-3 mb-5 rounded-md text-sm font-medium shadow-sm hover:bg-[#2a2a4a] transition flex items-center justify-center">
              Upload Flyer
              <input
                type="file"
                accept="image/*"
                onChange={handleFlyerChange}
                className="hidden"
              />
            </label>

            {flyerPreview ? (
              <div className="mt-5 w-full h-[460px] sm:h-[360px] relative rounded-md overflow-hidden border border-zinc-700 bg-[#0f0f17] flex items-center justify-center">
                <img
                  src={flyerPreview}
                  alt="preview"
                  className="max-w-full max-h-full object-contain"
                  draggable={false}
                  onLoad={onImageLoad}
                />
              </div>
            ) : (
              <div className="mt-6 pt-5 w-full h-[260px] sm:h-[360px] flex items-center justify-center rounded-md border border-dashed border-zinc-700 bg-[#0f0f17]">
                <span className="text-sm text-zinc-400">
                  No flyer selected. Upload to preview.
                </span>
              </div>
            )}
          </div>

          {/* Right: Metadata + description + tags/categories */}
          <div>
            <div className="mb-4">
              <Label className="mb-1">Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
                className="bg-[#111111] text-white border border-zinc-600 placeholder:text-zinc-500"
              />
            </div>

            {/* Tags */}
            <div className="mt-5">
              <Label className="mb-1">Tags</Label>
              <Input
                type="text"
                value={tagsInput}
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

            {/* Flyer Info */}
            {orientation && (
              <div className="mt-6 bg-[#1f1f2a] border border-zinc-700 rounded-2xl p-5 flex flex-col gap-2">
                <h2 className="text-lg font-semibold">Flyer Info</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-zinc-400">Width</span>
                    <span className="font-medium">{width}px</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-400">Height</span>
                    <span className="font-medium">{height}px</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-400">Orientation</span>
                    <span className="font-medium capitalize">{orientation}</span>
                  </div>
                  {displayType && (
                    <div className="flex flex-col">
                      <span className="text-zinc-400">Display Type</span>
                      <span className="font-medium capitalize">{displayType}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='flex items-center justify-center'>
        <Button className='w-2/3 py-3 bg-[#1111] border border-gray-200 rounded-sm mt-5'>
            Submit Flyer
        </Button>
        </div>

      </div>
    </div>
  );
}

export default Page;
