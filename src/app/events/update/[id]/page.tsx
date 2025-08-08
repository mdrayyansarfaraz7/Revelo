'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';
import { setDate } from 'date-fns';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';

function Page() {
    interface Registration {
        name?: string;
        createdAt?: string;
        [key: string]: any;
    }

    interface EventData {
        _id: string;
        title: string;
        category?: string;
        description: string;
        thumbnail: string;
        location: {
            venue: string;
            city: string;
            state?: string;
            country: string;
            pinCode?: string;
        };
        duration: string[];
        isTicketed: boolean;
        allowDirectRegistration: boolean;
        teamRequired?: boolean;
        teamSize?: { min: number; max: number };
        rules?: string[];
        ticketPrice: number;
        registrationFee: number;
        registrationStarts: string;
        registrationEnds: string;
    }

    const router = useRouter();
    const { id } = useParams();
    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(false);

    // Editable fields state
    const [description, setDescription] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [registrationStarts, setRegistrationStarts] = useState("");
    const [registrationEnds, setRegistrationEnds] = useState("");
    const [isTicketed, setIsTicketed] = useState(false);
    const [allowDirectRegistration, setAllowDirectRegistration] = useState(false);
    const [ticketPrice, setTicketPrice] = useState<number | "">("");
    const [registrationFee, setRegistrationFee] = useState<number | "">("");
    const [teamRequired, setTeamRequired] = useState(false);
    const [teamMin, setTeamMin] = useState<number | "">("");
    const [teamMax, setTeamMax] = useState<number | "">("");
    const [rules, setRules] = useState<string[]>([]);
    const [thumbanil, setThumbnail] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    useEffect(() => {
        if (!id) return;
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`/api/events/${id}`);
                const data: EventData = res.data;
                setEvent(data);

                // Prefill editable fields
                setDescription(data.description || "");
                setFromDate(data.duration[0].slice(0, 10) || "");
                setToDate(data.duration[1].slice(0, 10) || "");
                setRegistrationStarts(data.registrationStarts?.split("T")[0] || "");
                setRegistrationEnds(data.registrationEnds?.split("T")[0] || "");
                setIsTicketed(data.isTicketed);
                setAllowDirectRegistration(data.allowDirectRegistration);
                setTicketPrice(data.ticketPrice || "");
                setRegistrationFee(data.registrationFee || "");
                setTeamRequired(data.teamRequired || false);
                setTeamMin(data.teamSize?.min || "");
                setTeamMax(data.teamSize?.max || "");
                setRules(data.rules || []);
                setThumbnail(data.thumbnail);
                
            } catch (error) {
                console.error('Failed to fetch event:', error);
            }
        };
        fetchEvent();
    }, [id]);
    console.log(event);
    console.log("URL:",thumbanil);
    const handleUpdate = async () => {
        setLoading(true);
        try {
            let flyerUrl = thumbanil;

            if (file) {
                flyerUrl = await uploadToCloudinary(file);
            }

            const updates = {
                description,
                duration: [new Date(fromDate), new Date(toDate)],
                registrationStarts,
                registrationEnds,
                isTicketed,
                allowDirectRegistration,
                ticketPrice: ticketPrice || 0,
                registrationFee: registrationFee || 0,
                teamRequired,
                teamSize: teamRequired ? { min: teamMin || 1, max: teamMax || 1 } : undefined,
                rules,
                thumbnail: flyerUrl
            };
            console.log("UPDATES: ", updates);

            await axios.put(`/api/events/${id}`, updates);
            router.push(`/institute/event/${id}`);

        } catch (error) {
            console.error("Failed to update event:", error);
        } finally {
            setLoading(false);
        }
    };


    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <ClipLoader size={40} color="#9333ea" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 py-10">
            <Card className="w-full max-w-5xl bg-zinc-900 border border-zinc-800 text-white shadow-xl rounded-2xl">
                <CardHeader className="pb-4 border-b border-zinc-800">
                    <CardTitle className="text-3xl font-bold">Update Event</CardTitle>
                    <CardDescription className="text-zinc-400 mt-1">
                        Update allowed fields only. Locked fields cannot be changed.
                    </CardDescription>
                    <div className="bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-300 text-sm p-4 mt-4 rounded-md">
                        Updating this event will immediately reflect on Revelo. <strong>Title, category, and location</strong> are locked.
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Locked Title */}
                    <div>
                        <Label className="text-zinc-300">Title</Label>
                        <Input value={event.title} disabled className="bg-zinc-800 mt-3" />
                    </div>

                    {/* Description */}
                    <div>
                        <Label className="text-zinc-300">Description</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-zinc-800 mt-3"
                            rows={4}
                        />
                    </div>

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
                                    required
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
                                        <img
                                            src={thumbanil}
                                            alt="Preview"
                                            className="object-contain w-full h-64"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Event Starts</Label>
                            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                        </div>
                        <div>
                            <Label>Event Ends</Label>
                            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                        </div>
                    </div>

                    {/* Registration Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Registration Starts</Label>
                            <Input type="date" value={registrationStarts} onChange={(e) => setRegistrationStarts(e.target.value)} />
                        </div>
                        <div>
                            <Label>Registration Ends</Label>
                            <Input type="date" value={registrationEnds} onChange={(e) => setRegistrationEnds(e.target.value)} />
                        </div>
                    </div>

                    {
                        isTicketed && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label>Ticket Price</Label>
                                    <Input type="number" value={ticketPrice} onChange={(e) => setTicketPrice(Number(e.target.value))} disabled={!isTicketed} />
                                </div>

                            </div>
                        )
                    }


                    {/* Team Required */}
                    {allowDirectRegistration && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <Label>Registration Fee</Label>
                                <Input type="number" value={registrationFee} onChange={(e) => setRegistrationFee(Number(e.target.value))} disabled={!allowDirectRegistration} />
                            </div>
                            <div>
                                <Label>Team Required</Label>
                                <input type="checkbox" checked={teamRequired} onChange={(e) => setTeamRequired(e.target.checked)} className="ml-2" />
                            </div>
                            {teamRequired && (
                                <>
                                    <div>
                                        <Label>Team Min</Label>
                                        <Input type="number" value={teamMin} onChange={(e) => setTeamMin(Number(e.target.value))} />
                                    </div>
                                    <div>
                                        <Label>Team Max</Label>
                                        <Input type="number" value={teamMax} onChange={(e) => setTeamMax(Number(e.target.value))} />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Rules */}
                    {allowDirectRegistration && (
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
                    )}

                    {/* Submit */}
                    <div className="pt-6">
                        <Button onClick={handleUpdate} disabled={loading}>
                            {loading ? "Updating..." : "Save Changes"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Page;
