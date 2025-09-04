"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

interface InstituteOption {
  id: string;
  name: string;
}

interface UserType {
  fullName?: string;
  email?: string;
  profilePicture?: string;
  instituteName?: string;
  instituteRef?: string;
  IdProof?: string;
}

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [instituteRef, setInstituteRef] = useState("");
  const [idProof, setIdProof] = useState<File | null>(null);
  const [previewIdProof, setPreviewIdProof] = useState("");

  const [instituteOptions, setInstituteOptions] = useState<InstituteOption[]>([]);

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const res = await axios.get("/api/institute/all");
        if (res.data.success) {
          const formatted: InstituteOption[] = res.data.data.map((inst: any) => ({
            id: inst._id,
            name: inst.instituteName,
          }));
          setInstituteOptions(formatted);
        }
      } catch (error) {
        console.error("Error fetching institutes:", error);
      }
    };

    fetchInstitutes();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/user/${session.user.id}/profile`);
        setUser(data);
        setFullName(data.fullName || "");
        setPreviewImage(data.profilePicture || "");
        setInstituteName(data.instituteName || "");
        setInstituteRef(data.instituteRef?._id || "");
        setPreviewIdProof(data.IdProof || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePicture(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIdProof(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewIdProof(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setSaving(true);

    try {
      let profileUrl = previewImage;
      let idProofUrl = previewIdProof;

      if (profilePicture) {
        const uploaded = await uploadToCloudinary(profilePicture);
        profileUrl = uploaded;
      }

      if (idProof) {
        const uploaded = await uploadToCloudinary(idProof);
        idProofUrl = uploaded;
      }

      const payload = {
        fullName,
        instituteName,
        instituteRef,
        profilePicture: profileUrl,
        IdProof: idProofUrl,
      };

      await axios.patch(`/api/user/${session.user.id}/profile`, payload);
      router.push("/dashboard");
      console.log(payload);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <ClipLoader color="#5b3bff" size={50} />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0b0720] to-[#07060a] text-white flex items-center justify-center p-4 md:p-10">
      <Card className="w-full max-w-3xl shadow-2xl bg-gradient-to-tr from-[#0b071c] to-[#120a28] border border-[#2b2340]">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
          <CardTitle className="text-3xl font-bold text-white">Update Profile</CardTitle>
          <Button
            variant="ghost"
            className="text-white flex items-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} /> Back
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-4">
              {previewImage && (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden ring-2 bg-[#2b2340] flex items-center justify-center">
                  <Image
                    src={previewImage}
                    alt="Profile"
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileChange}
                className="
                  w-full 
                  text-white 
                  bg-[#1f1b2e] 
                  hover:bg-[#2b2340] 
                  px-5 py-3 
                  rounded-lg 
                  cursor-pointer 
                  border border-gray-700
                  file:mr-4 
                  file:py-2 
                  file:px-4 
                  file:rounded-lg 
                  file:border-none 
                  file:bg-[#5b3bff]/20 
                  file:text-white 
                  file:cursor-pointer
                "
              />
            </div>

            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-white mb-5">
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="text-white placeholder:text-gray-400"
              />
            </div>

            {/* Institute */}
            <div>
              <Label htmlFor="institute" className="text-white mb-5">
                Institute
              </Label>
              <Select
                value={instituteRef || "other"}
                onValueChange={(val) => {
                  setInstituteRef(val);

                  if (val === "other") {
                    setInstituteName(""); 
                  } else {
                    const selected = instituteOptions.find((ins) => ins.id === val);
                    setInstituteName(selected?.name || "");
                  }
                }}
              >
                <SelectTrigger className="text-white w-full">
                  <SelectValue placeholder="Select Institute" />
                </SelectTrigger>
                <SelectContent>
                  {instituteOptions.map((ins) => (
                    <SelectItem key={ins.id} value={ins.id}>
                      {ins.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              {instituteRef === "other" && (
                <Input
                  className="mt-2 text-white placeholder:text-gray-400"
                  placeholder="Enter your institute name"
                  value={instituteName}
                  onChange={(e) => setInstituteName(e.target.value)}
                />
              )}
            </div>

            {/* ID Proof */}
            <Label htmlFor="idProof" className="text-white">
              ID Proof
            </Label>
            <div className="flex flex-col items-center gap-4">
              {previewIdProof && (
                <div className="relative w-full max-w-md h-64 rounded-xl overflow-hidden ring-2 bg-[#2b2340] flex items-center justify-center">
                  <Image
                    src={previewIdProof}
                    alt="ID Proof"
                    fill
                    sizes="256px"
                    className="object-contain"
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleIdProofChange}
                className="
                  w-full 
                  text-white 
                  bg-[#1f1b2e] 
                  hover:bg-[#2b2340] 
                  px-5 py-3 
                  rounded-lg 
                  cursor-pointer 
                  border border-gray-700
                  file:mr-4 
                  file:py-2 
                  file:px-4 
                  file:rounded-lg 
                  file:border-none 
                  file:bg-[#5b3bff]/20 
                  file:text-white 
                  file:cursor-pointer
                "
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full flex justify-center items-center gap-2 text-white"
            >
              {saving ? <ClipLoader color="#fff" size={20} /> : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
