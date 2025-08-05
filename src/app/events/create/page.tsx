"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { loadRazorpayScript } from "../../../lib/rozorpay";

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
import axios from "axios";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function Page() {
  const Router = useRouter();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [registrationStarts, setRegistrationStarts] = useState("");
  const [registrationEnds, setRegistrationEnds] = useState("");

  const [allowDirectRegistration, setAllowDirectRegistration] = useState(false);
  const [isTicketed, setIsTicketed] = useState(false);
  const [registrationFee, setRegistrationFee] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  let imgURL = "";


  const handlePaymentAndSubmit = async () => {
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      toast.error("Failed to load Razorpay SDK");
      return;
    }

    const instituteRes = await axios.get("/api/institute/itsMe", {
      withCredentials: true,
    });

    const { name, email, instituteId } = instituteRes.data;

    const orderRes = await axios.post("/api/payment/create-order", {
      amount: 9900,
      purpose: "EventCreation",
    });

    const { order } = orderRes.data;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: order.amount,
      currency: "INR",
      name: "Revelo",
      description: "Platform Fee for Event Creation",
      order_id: order.id,
      handler: async function (response: any) {
        await handleSubmitAfterPayment({
          razorpayPaymentID: response.razorpay_payment_id,
          razorpayOrderID: response.razorpay_order_id,
          purpose: "EventCreation",
          amount: 9900,
        });
      },
      prefill: {
        name: name || "Institute Admin",
        email: email || "institute@example.com",
      },
      theme: {
        color: "#6366f1",
      },
    };

    const razor = new (window as any).Razorpay(options);
    razor.open();
  };


  const handleSubmitAfterPayment = async (paymentData: any) => {
    if (file) {
      imgURL = await uploadToCloudinary(file);
    }
    try {
      const response = await axios.get('/api/institute/itsMe', { withCredentials: true });
      const loggedInId = response.data.instituteId;
      const res = await axios.post("/api/events/create", {
        instituteID: loggedInId,
        title,
        description,
        category,
        thumbnail: imgURL,
        allowDirectRegistration,
        isTicketed,
        registrationFee,
        ticketPrice,
        venue,
        city,
        state,
        country,
        pinCode,
        from: fromDate,
        to: toDate,
        registrationStarts,
        registrationEnds,
        paymentData,
      });

      toast.success("Event created successfully!");
      Router.push(`/institute/dashboard/${loggedInId}`);
    } catch (err) {
      console.error("Event creation failed:", err);
      toast.error("Event creation failed. Try again.");
    }
  };


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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mt-0.5 shrink-0 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M12 5.5a7.5 7.5 0 11-.01 15.001A7.5 7.5 0 0112 5.5z"
              />
            </svg>
            <span>
              Once submitted, <strong>event details cannot be deleted</strong>.
              Ensure accuracy before proceeding. You can still edit some fields
              later.
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-zinc-300">Title</Label>
              <Input
                className="bg-zinc-800 text-white border-zinc-700 mt-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-zinc-300">Category</Label>
              <Select value={category} onValueChange={(val) => setCategory(val)}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white mt-3 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 text-white border-zinc-700">
                  <SelectItem value="Cultural Fest">Cultural Fest</SelectItem>
                  <SelectItem value="Tech Fest">Tech Fest</SelectItem>
                  <SelectItem value="Hackathon">Hackathon</SelectItem>
                  <SelectItem value="Ideathon">Ideathon</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Workshop">Sports</SelectItem>
                  <SelectItem value="Concerts">Concerts</SelectItem>
                  <SelectItem value="E-Summits">E-Summits</SelectItem>
                  <SelectItem value="Contest">Contest</SelectItem>
                  <SelectItem value="Carnival">Carnival</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8">
            <Label className="text-zinc-300">Detailed Description</Label>
            <Textarea
              placeholder="Describe the event, agenda, guests, rules, and other relevant info"
              className="bg-zinc-800 text-white border-zinc-700 mt-3"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* File Upload */}
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
            <div>
              <Label className="text-zinc-300">Allow Direct Registration</Label>
              <div className="flex items-center mt-3 space-x-3">
                <Checkbox
                  checked={allowDirectRegistration}
                  disabled={isTicketed}
                  onCheckedChange={(value) => {
                    setAllowDirectRegistration(value as boolean);
                    if (value) {
                      setIsTicketed(false);
                      setTicketPrice("");
                    }
                  }}
                />
                <span className="text-sm text-zinc-500">
                  Enables users to register without tickets
                </span>
              </div>
            </div>

            <div>
              <Label className="text-zinc-300">Registration Fee</Label>
              <Input
                type="number"
                value={registrationFee}
                onChange={(e) => setRegistrationFee(e.target.value)}
                disabled={!allowDirectRegistration}
                className="bg-zinc-800 text-white border-zinc-700 mt-3 disabled:opacity-50"
              />
            </div>

            <div>
              <Label className="text-zinc-300">Ticketed Entry</Label>
              <div className="flex items-center mt-3 space-x-3">
                <Checkbox
                  checked={isTicketed}
                  disabled={allowDirectRegistration}
                  onCheckedChange={(value) => {
                    setIsTicketed(value as boolean);
                    if (value) {
                      setAllowDirectRegistration(false);
                      setRegistrationFee("");
                    }
                  }}
                />
                <span className="text-sm text-zinc-500">
                  Requires users to buy a ticket
                </span>
              </div>
            </div>

            <div>
              <Label className="text-zinc-300">Ticket Price</Label>
              <Input
                type="number"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                disabled={!isTicketed}
                className="bg-zinc-800 text-white border-zinc-700 mt-3 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Input
              placeholder="Venue name"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="bg-zinc-800 text-white border-zinc-700"
            />
            <Input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-zinc-800 text-white border-zinc-700"
            />
            <Input
              placeholder="State (optional)"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="bg-zinc-800 text-white border-zinc-700"
            />
            <Input
              placeholder="Country (default: India)"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="bg-zinc-800 text-white border-zinc-700"
            />
            <Input
              placeholder="Pin Code (optional)"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="bg-zinc-800 text-white border-zinc-700"
            />
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
            <Label className="text-zinc-300 mb-2">Event starts</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-zinc-800 text-white border-zinc-700"
            />
            </div>
            <div>
            <Label className="text-zinc-300 mb-2">Event ends</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-zinc-800 text-white border-zinc-700"
            />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <Label className="text-zinc-300">Registration Starts</Label>
              <Input
                type="date"
                value={registrationStarts}
                onChange={(e) => setRegistrationStarts(e.target.value)}
                className="bg-zinc-800 text-white border-zinc-700 mt-3"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Registration Ends</Label>
              <Input
                type="date"
                value={registrationEnds}
                onChange={(e) => setRegistrationEnds(e.target.value)}
                className="bg-zinc-800 text-white border-zinc-700 mt-3"
              />
            </div>
          </div>

          <div className="pt-8 flex items-center justify-center">
            <Button
              type="button"
              onClick={handlePaymentAndSubmit}
              className="bg-[#1111] hover:bg-[#1f1d1db5] border-1 border-gray-300 text-white px-8 py-3 rounded-md text-md font-medium transition w-2/4"
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