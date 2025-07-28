"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { UploadCloud } from "lucide-react";


function Page() {
    const [file, setFile] = useState<File | null>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    type DateRange = {
        from?: Date;
        to?: Date;
    };

  const [allowDirectRegistration, setAllowDirectRegistration] = useState(false);
  const [isTicketed, setIsTicketed] = useState(false);
  const [registrationFee, setRegistrationFee] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");

    return (
        <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 py-10">
            <Card className="w-full max-w-7xl bg-zinc-900 border border-zinc-800 text-white shadow-xl rounded-2xl">
                <CardHeader className="pb-4 border-b border-zinc-800">
                    <CardTitle className="text-3xl font-bold text-white">
                        Create an Event
                    </CardTitle>
                    <CardDescription className="text-zinc-400 mt-1">
                        Fill out the details below to publish your event on Revelo.
                    </CardDescription>

                    <div className="bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-300 text-sm p-4 mt-4 rounded-md flex items-start space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 shrink-0 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 5.5a7.5 7.5 0 11-.01 15.001A7.5 7.5 0 0112 5.5z" />
                        </svg>
                        <span>
                            Once submitted, <strong>event details cannot be deleted</strong>. Ensure accuracy before proceeding. You can still edit some fields later.
                        </span>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label className="text-zinc-300" htmlFor="instituteName">
                                Title
                            </Label>
                            <Input
                                className="bg-zinc-800 text-white border-zinc-700 mt-3"
                                id="instituteName"
                            />
                        </div>

                        <div>
                            <Label className="text-zinc-300" htmlFor="category">
                                Category
                            </Label>
                            <Select>
                                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-3 w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 text-white border-zinc-700">
                                    <SelectItem value="cultural-fest">Cultural Fest</SelectItem>
                                    <SelectItem value="tech-fest">Tech Fest</SelectItem>
                                    <SelectItem value="hackathon">Hackathon</SelectItem>
                                    <SelectItem value="ideathon">Ideathon</SelectItem>
                                    <SelectItem value="workshop">Workshop</SelectItem>
                                    <SelectItem value="sports">Sports</SelectItem>
                                    <SelectItem value="concerts">Concerts</SelectItem>
                                    <SelectItem value="e-summits">E-Summits</SelectItem>
                                    <SelectItem value="contest">Contest</SelectItem>
                                    <SelectItem value="carnival">Carnival</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {/* Final Description */}
                    <div className="mt-8">
                        <Label className="text-zinc-300" htmlFor="final-description">Detailed Description</Label>
                        <Textarea
                            id="final-description"
                            placeholder="Describe the event, agenda, guests, rules, and other relevant info"
                            className="bg-zinc-800 text-white border-zinc-700 mt-3"
                            rows={6}
                        />
                        <p className="text-sm text-zinc-500 mt-1">
                            Give participants a clear idea of what to expect
                        </p>
                    </div>


                    {/* File Upload Section */}
                    <div>
                        <Label className="text-zinc-300 mb-2 block">Upload Flyer</Label>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-[60%]">
                                <label
                                    htmlFor="file-upload"
                                    className="border-1 border-dashed border-purple-400 bg-zinc-800 flex flex-col items-center justify-center text-center px-6 py-10 rounded-xl cursor-pointer hover:border-purple-400 transition duration-300"
                                >
                                    <UploadCloud className="text-purple-400 w-10 h-10 mb-2" />
                                    <span className="bg-purple-400 text-black px-20 py-2 rounded-md text-sm font-medium">
                                        Browse
                                    </span>
                                    <p className="text-zinc-400 mt-2">or drop a file here</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        *File supported: .png, .jpg & .webp
                                    </p>
                                </label>
                                <input
                                    type="file"
                                    id="file-upload"
                                    accept=".png, .jpg, .jpeg, .webp"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                {file && (
                                    <p className="text-green-400 mt-2 text-sm">
                                        Selected: {file.name}
                                    </p>
                                )}
                            </div>

                            {/* Preview area - 40% */}
                            <div className="w-full md:w-[40%] flex items-center justify-center bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden relative">
                                {file ? (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="Preview"
                                        className="object-contain w-full h-64"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-44 w-full text-zinc-500">
                                        <UploadCloud className="w-10 h-10 mb-2 text-purple-400" />
                                        <p className="text-sm">No image uploaded</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Direct Registration */}
      <div>
        <Label className="text-zinc-300" htmlFor="allowDirectRegistration">
          Allow Direct Registration
        </Label>
        <div className="flex items-center mt-3 space-x-3">
          <Checkbox
            id="allowDirectRegistration"
            checked={allowDirectRegistration}
            disabled={isTicketed}
            onCheckedChange={(value) => {
              setAllowDirectRegistration(value as boolean);
              if (value) {
                setIsTicketed(false);
                setTicketPrice(""); // Reset ticket price if toggled
              }
            }}
          />
          <span className="text-sm text-zinc-500">
            Enables users to register without tickets
          </span>
        </div>
      </div>

      {/* Registration Fee */}
      <div>
        <Label className="text-zinc-300" htmlFor="registrationFee">
          Registration Fee
        </Label>
        <Input
          id="registrationFee"
          type="number"
          placeholder="e.g., 50"
          value={registrationFee}
          onChange={(e) => setRegistrationFee(e.target.value)}
          disabled={!allowDirectRegistration}
          className="bg-zinc-800 text-white border-zinc-700 mt-3 disabled:opacity-50"
        />
        <p className="text-sm text-zinc-500 mt-1">
          Fee in INR for direct registration (0 for free)
        </p>
      </div>

      {/* Ticketed Entry */}
      <div>
        <Label className="text-zinc-300" htmlFor="isTicketed">
          Ticketed Entry
        </Label>
        <div className="flex items-center mt-3 space-x-3">
          <Checkbox
            id="isTicketed"
            checked={isTicketed}
            disabled={allowDirectRegistration}
            onCheckedChange={(value) => {
              setIsTicketed(value as boolean);
              if (value) {
                setAllowDirectRegistration(false);
                setRegistrationFee(""); // Reset registration fee if toggled
              }
            }}
          />
          <span className="text-sm text-zinc-500">
            Requires users to buy a ticket
          </span>
        </div>
      </div>

      {/* Ticket Price */}
      <div>
        <Label className="text-zinc-300" htmlFor="ticketPrice">
          Ticket Price
        </Label>
        <Input
          id="ticketPrice"
          type="number"
          placeholder="e.g., 100"
          value={ticketPrice}
          onChange={(e) => setTicketPrice(e.target.value)}
          disabled={!isTicketed}
          className="bg-zinc-800 text-white border-zinc-700 mt-3 disabled:opacity-50"
        />
        <p className="text-sm text-zinc-500 mt-1">
          Applicable only if ticketing is enabled
        </p>
      </div>
    </div>


                    {/* Location Details */}
                    <div className="mt-8 space-y-4">
                        <Label className="text-zinc-300">Location</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
                            <div>
                                <Input className="bg-zinc-800 text-white border-zinc-700" placeholder="Venue name" />
                                <p className="text-sm text-zinc-500 mt-1">Exact venue (e.g., Main Auditorium)</p>
                            </div>
                            <div>
                                <Input className="bg-zinc-800 text-white border-zinc-700" placeholder="City" />
                                <p className="text-sm text-zinc-500 mt-1">e.g., Delhi, Mumbai</p>
                            </div>
                            <div>
                                <Input className="bg-zinc-800 text-white border-zinc-700" placeholder="State (optional)" />
                            </div>
                            <div>
                                <Input className="bg-zinc-800 text-white border-zinc-700" placeholder="Country (default: India)" />
                            </div>
                            <div>
                                <Input className="bg-zinc-800 text-white border-zinc-700" placeholder="Pin Code (optional)" />
                            </div>
                        </div>
                    </div>
                    {/* Dates */}

                    <div>
                        <Label className="text-zinc-300">Duration</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
                            <div>
                                <Label htmlFor="from-date" className="text-sm text-zinc-400 mb-1 block">From Date</Label>
                                <Input
                                    type="date"
                                    id="from-date"
                                    className="bg-zinc-800 text-white border-zinc-700"
                                />
                            </div>
                            <div>
                                <Label htmlFor="to-date" className="text-sm text-zinc-400 mb-1 block">To Date</Label>
                                <Input
                                    type="date"
                                    id="to-date"
                                    className="bg-zinc-800 text-white border-zinc-700"
                                />
                            </div>
                        </div>
                        <p className="text-sm text-zinc-500 mt-2">Select the start and end date of the event</p>
                    </div>

                    <div className="pt-8 flex items-center justify-center">
                        <Button
                            type="submit"
                            className=" bg-[#1111] hover:bg-[#1f1d1db5] border-1 border-gray-300 text-white px-8 py-3 rounded-md text-md font-medium transition w-2/4"
                        >
                            Submit Event
                        </Button>
                    </div>


                </CardContent>
            </Card>
        </div>
    );
}

export default Page;
