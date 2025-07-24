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
import { UploadCloud } from "lucide-react"

export default function InstituteRegisterPage() {
    const [logoName, setLogoName] = useState("")
    const [letterName, setLetterName] = useState("")
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)

    useEffect(() => {
        if (logoFile) {
            const url = URL.createObjectURL(logoFile)
            setLogoPreview(url)
            return () => URL.revokeObjectURL(url)
        }
    }, [logoFile])

    return (
        <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 py-10">
            <Card className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 text-white shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-white">Institute Registration</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label className="text-zinc-300" htmlFor="instituteName">Institute Name</Label>
                            <Input className="bg-zinc-800 text-white border-zinc-700 mt-3" id="instituteName" />
                        </div>
                        <div>
                            <Label className="text-zinc-300" htmlFor="instituteType">Institute Type</Label>
                            <Select>
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
                            <Input className="bg-zinc-800 text-white border-zinc-700 mt-3" id="officeEmail" type="email" />
                        </div>
                        <div>
                            <Label className="text-zinc-300" htmlFor="contactNumber">Contact Number</Label>
                            <Input className="bg-zinc-800 text-white border-zinc-700 mt-3" id="contactNumber" />
                        </div>
                    </div>

                    <div>
                        <Label className="text-zinc-300" htmlFor="address">Address</Label>
                        <Textarea className="bg-zinc-800 text-white border-zinc-700 mt-3" id="address" rows={3} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label className="text-zinc-300" htmlFor="state">State</Label>
                            <Input className="bg-zinc-800 text-white border-zinc-700 mt-3" id="state" />
                        </div>
                        <div>
                            <Label className="text-zinc-300" htmlFor="country">Country</Label>
                            <Input className="bg-zinc-800 text-white border-zinc-700 mt-3" id="country" />
                        </div>
                    </div>

                    {/* Custom File Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Logo */}
                        <div>
                            <Label className="text-zinc-300">Institute Logo (PNG/JPEG)</Label>
                            <div>
                            
                                <div
                                    className="mt-2 flex items-center justify-between border border-dashed border-zinc-600 bg-zinc-800 rounded-md px-4 py-3 cursor-pointer hover:border-zinc-400 transition"
                                    onClick={() => document.getElementById("logoUpload")?.click()}
                                >
                                    <div className="flex items-center gap-2 text-zinc-300">
                                        <UploadCloud className="w-4 h-4" />
                                        <span>{logoFile?.name || "Click to upload logo"}</span>
                                    </div>
                                    <Input
                                        type="file"
                                        id="logoUpload"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) setLogoFile(file)
                                        }}
                                        className="hidden"
                                    />
                                </div>

                                {/* Preview */}
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

                        {/* Verification Letter */}
                        <div>
                            <Label className="text-zinc-300">Verification Letter (PDF)</Label>
                            <div className="mt-2 flex items-center justify-between border border-dashed border-zinc-600 bg-zinc-800 rounded-md px-4 py-3 cursor-pointer hover:border-zinc-400 transition"
                                onClick={() => document.getElementById("letterUpload")?.click()}
                            >
                                <div className="flex items-center gap-2 text-zinc-300">
                                    <UploadCloud className="w-4 h-4" />
                                    <span>{letterName || "Click to upload PDF letter"}</span>
                                </div>
                                <Input
                                    type="file"
                                    id="letterUpload"
                                    accept="application/pdf"
                                    onChange={(e) => setLetterName(e.target.files?.[0]?.name || "")}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label className="text-zinc-300" htmlFor="password">Create Password</Label>
                        <Input className="bg-zinc-800 text-white border-zinc-700 mt-3" id="password" type="password" />
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-4 px-8 pb-8">
                    <Button
                        variant="ghost"
                        className="text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-white text-black hover:bg-zinc-200 transition font-semibold px-6"
                    >
                        Register
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
