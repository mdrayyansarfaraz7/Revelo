"use client"
import {
    Card, CardContent, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
    Select, SelectTrigger, SelectContent, SelectItem, SelectValue
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { UploadCloud, Loader2 } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation";

export default function InstituteRegisterPage() {
    const [instituteName, setInstituteName] = useState("");
    const [instituteType, setInstituteType] = useState("")
    const [officeEmail, setOfficeEmail] = useState("")
    const [contactNumber, setContactNumber] = useState("")
    const [address, setAddress] = useState("")
    const [state, setState] = useState("")
    const [country, setCountry] = useState("")
    const [password, setPassword] = useState("")
    const [verificationLetter, setVerificationLetter] = useState<File | null>(null)
    const [logoFile, setLogoFile] = useState<File | null>(null)

    const [letterName, setLetterName] = useState("")
    const [logoPreview, setLogoPreview] = useState<string | null>(null)

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

      const router = useRouter();
      
    

    useEffect(() => {
        if (logoFile) {
            const url = URL.createObjectURL(logoFile)
            setLogoPreview(url)
            return () => URL.revokeObjectURL(url)
        }
    }, [logoFile])

    const handleSubmit = async () => {
        setLoading(true);
        setSuccessMessage("");

        try {
            let logoUrl = "";
            let verificationLetterUrl = "";
            if (logoFile) {
                logoUrl = await uploadToCloudinary(logoFile);
            }
            if (verificationLetter) {
                verificationLetterUrl = await uploadToCloudinary(verificationLetter);
            }
            const payload = {
                instituteName,
                instituteType,
                officeEmail,
                contactNumber,
                address,
                state,
                country,
                password,
                logoUrl,
                verificationLetterUrl,
            };

            await axios.post("/api/register-institute", payload);

            setSuccessMessage("Your account will be activated within 24 hours. You may log in afterwards.");
        } catch (error: any) {
            toast.error(error?.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Link href='/'>
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={120}
                    height={40}
                    className="object-contain mx-8 my-4"
                    priority
                />
            </Link>

            <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 py-10">

                <Card className="w-full max-w-6xl bg-zinc-900 border border-zinc-800 text-white shadow-xl rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-white">Institute Registration</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6 px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-zinc-300" htmlFor="instituteName">Institute Name</Label>
                                <Input disabled={loading} className="bg-zinc-800 text-white border-zinc-700 mt-3" id="instituteName" onChange={(e) => setInstituteName(e.target.value)} />
                            </div>
                            <div>
                                <Label className="text-zinc-300" htmlFor="instituteType">Institute Type</Label>
                                <Select disabled={loading} onValueChange={setInstituteType}>
                                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-3" >
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 text-white border-zinc-700">
                                        <SelectItem value="school">School</SelectItem>
                                        <SelectItem value="institute">Institute</SelectItem>
                                        <SelectItem value="university">University</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-zinc-300" htmlFor="officeEmail">Official Email</Label>
                                <Input disabled={loading} className="bg-zinc-800 text-white border-zinc-700 mt-3" id="officeEmail" type="email" onChange={(e) => setOfficeEmail(e.target.value)} />
                            </div>
                            <div>
                                <Label className="text-zinc-300" htmlFor="contactNumber">Contact Number</Label>
                                <Input disabled={loading} className="bg-zinc-800 text-white border-zinc-700 mt-3" id="contactNumber" onChange={(e) => setContactNumber(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <Label className="text-zinc-300" htmlFor="address">Address</Label>
                            <Textarea disabled={loading} className="bg-zinc-800 text-white border-zinc-700 mt-3" id="address" rows={5} onChange={(e) => setAddress(e.target.value)} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <Label className="text-zinc-300" htmlFor="state">State</Label>
                                <Input disabled={loading} className="bg-zinc-800 text-white border-zinc-700 mt-3" id="state" onChange={(e) => setState(e.target.value)} />
                            </div>
                            <div>
                                <Label className="text-zinc-300" htmlFor="country">Country</Label>
                                <Input disabled={loading} className="bg-zinc-800 text-white border-zinc-700 mt-3" id="country" onChange={(e) => setCountry(e.target.value)} />
                            </div>

                            <div>
                                <Label className="text-zinc-300" htmlFor="password">Create Password</Label>
                                <Input
                                    className="bg-zinc-800 text-white border-zinc-700 mt-3"
                                    id="password"
                                    type="password"
                                    disabled={loading}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-zinc-300">Institute Logo (PNG/JPEG)</Label>
                                <div>
                                    <div
                                        className="mt-2 flex items-center justify-between border border-dashed border-zinc-600 bg-zinc-800 rounded-md px-4 py-3 cursor-pointer hover:border-zinc-400 transition"
                                        onClick={() => !loading && document.getElementById("logoUpload")?.click()}
                                    >
                                        <div className="flex items-center gap-2 text-zinc-300">
                                            <UploadCloud className="w-4 h-4" />
                                            <span>{logoFile?.name || "Click to upload logo"}</span>
                                        </div>
                                        <Input
                                            type="file"
                                            id="logoUpload"
                                            accept="image/*"
                                            disabled={loading}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) setLogoFile(file)
                                            }}
                                            className="hidden"
                                        />
                                    </div>

                                    {logoPreview && (
                                        <div className="mt-4 flex items-center gap-4">
                                            <img
                                                src={logoPreview}
                                                alt="Logo preview"
                                                className="w-20 h-20 object-contain rounded-md border border-zinc-700"
                                            />
                                            <span className="text-sm text-zinc-400">{logoFile?.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label className="text-zinc-300">Verification Letter (PNG/JPEG)</Label>
                                <div className="mt-2 flex items-center justify-between border border-dashed border-zinc-600 bg-zinc-800 rounded-md px-4 py-3 cursor-pointer hover:border-zinc-400 transition"
                                    onClick={() => !loading && document.getElementById("letterUpload")?.click()}
                                >
                                    <div className="flex items-center gap-2 text-zinc-300">
                                        <UploadCloud className="w-4 h-4" />
                                        <span>{letterName || "Click to upload Verification letter"}</span>
                                    </div>
                                    <Input
                                        type="file"
                                        id="letterUpload"
                                        accept="image/*"
                                        disabled={loading}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setVerificationLetter(file);
                                                setLetterName(file.name);
                                            }
                                        }}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>



                        {successMessage && (
                            <div className="text-green-400 text-sm pt-4">{successMessage}</div>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-end gap-4 px-8 pb-8">
                        <Button
                            disabled={loading}
                            className="bg-white text-black hover:bg-zinc-200 transition font-semibold px-8 w-20"
                            onClick={handleSubmit}
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Register"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>

    )
}
