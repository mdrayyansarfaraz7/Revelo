"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";


interface SubEventData {
  _id: string;
  title: string;
  banner: string;
  category: string;
  contactDetails: string;
  createdAt: string;
  updatedAt: string;
  price: number;
  registrations: any[];
  rules: string[];
  scheduledAt: string;
  teamRequired: boolean;
  teamSize: { min: number; max: number };
  venue: string;
}

export default function Page() {
  const router = useRouter();
  const { subEventId,eventId } = useParams();

  const [subEvent, setSubEvent] = useState<SubEventData | null>(null);

  // Controlled fields
  const [title, setTitle] = useState("");
  const [banner, setBanner] = useState("");
  const [category, setCategory] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [teamRequired, setTeamRequired] = useState(false);
  const [teamMin, setTeamMin] = useState(1);
  const [teamMax, setTeamMax] = useState(1);
  const [venue, setVenue] = useState("");
  const [rules, setRules] = useState<string[]>([]);

  // Upload states
  const [uploading, setUploading] = useState(false);

  function formatForDateTimeLocal(isoString: string | null | undefined) {
    if (!isoString) return "";
    const date = new Date(isoString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  }

    function toUTCISOString(localDateTime: string): string {
    if (!localDateTime) return "";
    return new Date(localDateTime).toISOString();
  }

  useEffect(() => {
    if (!subEventId) return;
    const fetchSubEventDetails = async () => {
      try {
        const res = await axios.get(`/api/sub-events/${subEventId}`);
        const data: SubEventData = res.data.subevent;
        setSubEvent(data);

        setTitle(data.title ?? "");
        setBanner(data.banner ?? "");
        setCategory(data.category ?? "");
        setContactDetails(data.contactDetails ?? "");
        setPrice(typeof data.price === "number" ? data.price : "");
        setScheduledAt(data.scheduledAt ?? "");
        setTeamRequired(Boolean(data.teamRequired));
        setTeamMin(data.teamSize?.min ?? 1);
        setTeamMax(data.teamSize?.max ?? 1);
        setVenue(data.venue ?? "");
        setRules(data.rules || []);
      } catch (error) {
        toast.error("Failed to fetch sub-event.");
      }
    };
    fetchSubEventDetails();
  }, [subEventId]);

  const [file, setFile] = useState<File | null>(null);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {

    let bannerURL=banner;
    if(file){
      bannerURL= await uploadToCloudinary(file);
    }

    const updateFields = {
      contactDetails,
      banner:bannerURL,
      price: typeof price === "number" ? price : 0,
      scheduledAt:toUTCISOString(scheduledAt),
      teamRequired,
      teamSize: { min: teamMin, max: teamMax },
      venue,
      rules
    };

      try {
    const res = await axios.put(`/api/sub-events/${subEventId}`, updateFields );
    console.log("Updated:", res.data);
    router.back();
    
  } catch (err) {
    console.error("Error updating sub-event:", err);
  }

    console.log("data to upload", updateFields);
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-5xl bg-zinc-900 border border-zinc-800 text-white shadow-xl rounded-2xl">
        <CardHeader className="pb-4 border-b border-zinc-800">
          <CardTitle className="text-3xl font-bold">Update Sub-Event</CardTitle>
          <CardDescription className="text-zinc-400 mt-1">
            Update allowed fields only. Locked fields cannot be changed.
          </CardDescription>
          <div className="bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-300 text-sm p-4 mt-4 rounded-md">
            Updating this sub-event will immediately reflect on Revelo. <strong>Title and Category</strong> are locked.
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Title (locked) */}
          <div>
            <Label>Title</Label>
            <Input value={title} disabled className="bg-zinc-800 mt-2" />
          </div>

          {/* Category & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Category</Label>
              <Input value={category} disabled className="bg-zinc-800 mt-2" />
            </div>
            <div>
              <Label>Contact Details</Label>
              <Input
                value={contactDetails}
                onChange={(e) => setContactDetails(e.target.value)}
                placeholder="Phone / Email / Discord..."
                className="bg-zinc-800 mt-2"
              />
            </div>
          </div>

          {/* Price & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Price (INR)</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="bg-zinc-800 mt-2"
              />
            </div>
            <div>
              <Label>Scheduled At</Label>
              <Input
                type="datetime-local"
                value={formatForDateTimeLocal(scheduledAt)}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="bg-zinc-800 mt-2"
              />
            </div>
          </div>

          {/* Team & Venue */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label>Team Required</Label>
              <select
                value={teamRequired ? "yes" : "no"}
                onChange={(e) => setTeamRequired(e.target.value === "yes")}
                className="bg-zinc-800 mt-2 w-full rounded-md px-3 py-2"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            {teamRequired && (
              <>
                <div>
                  <Label>Min Team Size</Label>
                  <Input
                    type="number"
                    value={teamMin}
                    onChange={(e) => setTeamMin(Number(e.target.value))}
                    className="bg-zinc-800 mt-2"
                  />
                </div>
                <div>
                  <Label>Max Team Size</Label>
                  <Input
                    type="number"
                    value={teamMax}
                    onChange={(e) => setTeamMax(Number(e.target.value))}
                    className="bg-zinc-800 mt-2"
                  />
                </div>
              </>
            )}

            <div>
              <Label>Venue</Label>
              <Input value={venue} onChange={(e) => setVenue(e.target.value)} className="bg-zinc-800 mt-2" />
            </div>
          </div>

          {/* Banner Upload */}
          <div>

            <div className="flex flex-col  gap-4 mt-2">
              <label className="cursor-pointer  bg-[#1f1f2a] px-5 py-3 rounded-md text-sm font-medium shadow-sm hover:bg-[#2a2a4a] transition flex items-center justify-center gap-2">
                Update Banner
                <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
              </label>
              <div className="flex justify-center items-center">
                <div className="w-[50%] aspect-[3/4] relative rounded-md overflow-hidden border border-zinc-700">
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Banner Preview"
                      className="object-cover w-full h-full"
                    />
                  ) : banner ? (
                    <img
                      src={banner}
                      alt="Banner"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-zinc-800 text-zinc-500 text-sm">
                      <ClipLoader size={40} color="#9333ea" />
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>


          <div>
            <Label>Rules</Label>
            {rules.map((rule, i) => (
              <div key={i} className="flex gap-2 mt-2">
                <Input value={rule} onChange={(e) => {
                  const newRules = [...rules];
                  newRules[i] = e.target.value;
                  setRules(newRules);
                }} />
                <Button type="button" onClick={() => setRules(rules.filter((_, idx) => idx !== i))}>×</Button>
              </div>
            ))}
            <Button type="button" onClick={() => setRules([...rules, ""])} className="mt-2">+ Add Rule</Button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={uploading}
              className="bg-[#1a1a1a] text-white px-8 py-2 rounded flex items-center justify-center gap-3 font-medium hover:shadow-[0_0_10px_#c084fc66] transition-all border border-gray-700"
            >
              {uploading ? "Uploading..." : "Save Changes"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
