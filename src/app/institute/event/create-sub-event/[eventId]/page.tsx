"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

export default function CreateSubEventPage() {
    const router = useRouter();
    const { eventId } = useParams() as { eventId: string };

    const [title, setTitle] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");
    const [venue, setVenue] = useState("");
    const [price, setPrice] = useState<number | "">("");
    const [teamRequired, setTeamRequired] = useState(false);
    const [teamMin, setTeamMin] = useState(1);
    const [teamMax, setTeamMax] = useState(1);
    const [category, setCategory] = useState("");
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [contactDetails, setContactDetails] = useState("");
    const [rules, setRules] = useState<string[]>([""]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdSubEventId, setCreatedSubEventId] = useState<string | null>(null);

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setBannerFile(e.target.files[0]);
            setBannerPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const addRule = () => setRules((r) => [...r, ""]);
    const updateRule = (idx: number, val: string) => {
        setRules((r) => {
            const copy = [...r];
            copy[idx] = val;
            return copy;
        });
    };
    const removeRule = (idx: number) => {
        setRules((r) => r.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !title.trim() ||
            !scheduledAt ||
            !venue.trim() ||
            !category.trim() ||
            !contactDetails.trim() ||
            rules.every((r) => !r.trim())
        ) {
            toast.error("Please fill all required fields and provide at least one rule.");
            return;
        }
        if (teamRequired && teamMin > teamMax) {
            toast.error("Team min cannot be greater than max.");
            return;
        }

        setIsSubmitting(true);
        try {
            let bannerURL = "";
            if (bannerFile) {
                bannerURL = await uploadToCloudinary(bannerFile);
            }

            const payload = {
                eventId,
                title,
                scheduledAt: new Date(scheduledAt).toISOString(),
                venue,
                price: price === "" ? 0 : Number(price),
                teamRequired,
                teamSize: { min: teamMin, max: teamMax },
                category,
                banner: bannerURL,
                contactDetails,
                rules: rules.filter((r) => r.trim()),
            };

            console.log("Submitting payload:", payload);

            const res = await axios.post(
                "/api/sub-events/create",
                payload,
                { withCredentials: true }
            );
            const created = res.data.subEvent || res.data;

            if (res.status === 201 || res.status === 200) {
                setCreatedSubEventId(created._id || created.id);
                toast.success("Sub-event created successfully!");

                setTimeout(() => {
                    router.push(`/institute/event/${eventId}`);
                }, 1400);
            } else {
                toast.error("Failed to create sub-event.");
            }
        } catch (err) {
            console.error("Error creating sub-event:", err);
            toast.error("Failed to create sub-event.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#111111] text-white py-12 px-6 md:px-12">
            <div className="max-w-3xl mx-auto bg-[#111111] rounded-2xl shadow-lg border border-zinc-800 p-10">
                <div className="mb-5">
                    <h1 className="text-3xl font-semibold leading-tight">Create Sub Event</h1>
                    <p className="text-zinc-400 mt-1">
                        Fill in the details below. After creation you’ll be redirected back to the parent event.
                    </p>
                </div>

                <div className="flex items-start gap-3 bg-yellow-900/10 border-l-4 border-yellow-500 text-yellow-300 text-sm p-3 rounded-md mb-6">
                    <div className="flex-1">
                        <strong className="block">Note:</strong>
                        <span>Once a sub-event is created, it may not be changed or updated.</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Title + Scheduled At */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label className="mb-1">Title</Label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Sub event title"
                                className="bg-[#111111] text-white border-1 border-gray-200 placeholder:text-zinc-500"
                            />
                        </div>
                        <div>
                            <Label className="mb-1">Scheduled At</Label>
                            <Input
                                type="datetime-local"
                                value={scheduledAt}
                                onChange={(e) => setScheduledAt(e.target.value)}
                                className="bg-[#111111] text-white border-1 border-gray-200"
                            />
                        </div>
                    </div>

                    {/* Venue / Category / Price */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label className="mb-1">Venue</Label>
                            <Input
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                placeholder="Venue"
                                className="bg-[#111111] text-whiteborder-1 border-gray-200"
                            />
                        </div>
                        <div>
                            <Label className="mb-1">Category</Label>
                            <Input
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g., Workshop"
                                className="bg-[#111111] text-white border-1 border-gray-200"
                            />
                        </div>
                        <div>
                            <Label className="mb-1">Price (₹)</Label>
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) =>
                                    setPrice(e.target.value === "" ? "" : Number(e.target.value))
                                }
                                placeholder="0"
                                className="bg-[#111111] text-white border-1 border-gray-200"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label className="mb-1">Team Required</Label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={teamRequired}
                                    onChange={(e) => setTeamRequired(e.target.checked)}
                                    className="accent-purple-600"
                                />
                                <span className="text-sm text-zinc-300">Yes</span>
                            </div>
                        </div>
                        {teamRequired && (
                            <>
                                <div>
                                    <Label className="mb-1">Team Min</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={teamMin}
                                        onChange={(e) => setTeamMin(Number(e.target.value))}
                                        className="bg-[#111111] text-white border-1 border-gray-200"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-1">Team Max</Label>
                                    <Input
                                        type="number"
                                        min={teamMin}
                                        value={teamMax}
                                        onChange={(e) => setTeamMax(Number(e.target.value))}
                                        className="bg-[#111111] text-white border-1 border-gray-200"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Contact */}
                    <div>
                        <Label className="mb-1">Contact Details</Label>
                        <Input
                            value={contactDetails}
                            onChange={(e) => setContactDetails(e.target.value)}
                            placeholder="Email / Phone / Discord"
                            className="bg-[#111111] text-white border-1 border-gray-200"
                        />
                    </div>

                    <div>
                        <Label className="mb-1">Banner</Label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <label className="cursor-pointer bg-[#1f1f2a] px-5 py-3 rounded-md text-sm font-medium shadow-sm hover:bg-[#2a2a4a] transition flex items-center gap-2">
                                Upload Banner
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBannerChange}
                                    className="hidden"
                                />
                            </label>
                            {bannerPreview && (
                                <div className="w-full sm:w-auto flex-shrink-0 h-28 relative rounded-md overflow-hidden border border-zinc-700">
                                    <img
                                        src={bannerPreview}
                                        alt="preview"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rules (full width) */}
                    <div>
                        <Label className="mb-1">Rules</Label>
                        <div className="space-y-2">
                            <div className="max-h-56 overflow-y-auto hide-scrollbar bg-[#0b0c0f] rounded-md p-3 space-y-2">
                                {rules.map((r, i) => (
                                    <div key={i} className="flex gap-2 items-start">
                                        <div className="flex-1">
                                            <Input
                                                value={r}
                                                onChange={(e) => updateRule(i, e.target.value)}
                                                placeholder={`Rule ${i + 1}`}
                                                className="bg-[#111111] text-white border-1 border-gray-200"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeRule(i)}
                                            className="text-red-400 font-bold mt-1 px-2"
                                            aria-label="Remove rule"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <Button
                                    size="sm"
                                    onClick={addRule}
                                    className="mt-1"
                                     type="button" 
                                >
                                    + Add Rule
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Submit + created ID */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 font-medium"
                            >
                                {isSubmitting ? "Creating..." : "Create Sub Event"}
                            </Button>
                        </div>

                        {createdSubEventId && (
                            <div className="bg-yellow-900/10 border-l-4 border-yellow-500 text-yellow-300 text-sm p-3 rounded-md">
                                <div>
                                    <strong className="block">Sub Event Created</strong>
                                    <div>
                                        ID: <code className="bg-[#1f1f2a] px-1 py-0.5 rounded">{createdSubEventId}</code>. Keep this for reference.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
