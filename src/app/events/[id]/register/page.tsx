"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { loadRazorpayScript } from "../../../../lib/rozorpay";
import { ClipLoader } from "react-spinners";
import { useSession } from "next-auth/react";

interface TeamMember {
  _id: string;
  fullName: string;
  username: string;
  profilePicture: string;
}

interface TeamData {
  _id: string;
  name: string;
  leader: TeamMember;
  members: TeamMember[];
}

interface Event {
  _id: string;
  title: string;
  category: string;
  banner: string;
  registrationFee?: number;
  allowDirectRegistration: boolean;
  teamRequired: boolean;
  teamSize: { min: number; max: number };
}

export default function RegisterEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [joiningCode, setJoiningCode] = useState("");
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const { update } = useSession();

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      console.log("Fetching event details for ID:", eventId);
      try {
        const res = await axios.get(`/api/events/${eventId}`);
        console.log("Event fetch response:", res.data);
        setEvent(res.data); // ✅ FIX
      } catch (err) {
        console.error("Failed to load event:", err);
        toast.error("Failed to load event.");
      }
    };
    if (eventId) fetchEvent();
  }, [eventId]);

  // Join team handler
  const handleJoinTeam = async () => {
    if (!joiningCode) return toast.error("Enter team code!");
    try {
      setLoading(true);
      console.log("Verifying team with code:", joiningCode);
      const res = await axios.post(`/api/team/verify`, {
        joiningCode,
        eventId,
        eventModel:"Event"
      });
      console.log("Team verify response:", res.data);
      if (
        res.data.team.members.length  < event!.teamSize.min ||
        res.data.team.members.length  > event!.teamSize.max
      ) {
        toast.error("Team size does not match the event criteria.");
        console.warn("Team size mismatch:", res.data.team.members.length + 1);
        return;
      }
      setTeamData(res.data.team);
      toast.success("Team verified!");
    } catch (err: any) {
      console.error("Team verification failed:", err);
      toast.error(err?.response?.data?.error || "Team verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const handleRegister = async () => {
    if (!event) {
      toast.error("Event not loaded.");
      console.warn("No event data while registering.");
      return;
    }

    if (!event.allowDirectRegistration) {
      toast.error("Direct registration not allowed for this event.");
      console.warn("Tried registering for event without direct registration.");
      return;
    }

    if (event.teamRequired && !teamData) {
      toast.error("Please verify your team first.");
      console.warn("Team required but not verified.");
      return;
    }

    try {
      setLoading(true);
      console.log("Initiating registration for event:", event);

      if (event.registrationFee && event.registrationFee > 0) {
        console.log("Paid event detected, loading Razorpay...");
        const sdkLoaded = await loadRazorpayScript();
        if (!sdkLoaded) {
          toast.error("Failed to load Razorpay SDK");
          console.error("Razorpay SDK load failed.");
          return;
        }

        const orderRes = await axios.post("/api/payment/create-order", {
          amount: event.registrationFee * 100,
        });
        const { order } = orderRes.data;
        console.log("Order created:", order);

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          amount: order.amount,
          currency: "INR",
          name: "Revelo",
          description: `Registration for ${event?.title}`,
          order_id: order.id,
          handler: async function (response: any) {
            console.log("Razorpay payment success:", response);
            try {
              await axios.post(`/api/registration/${eventId}`, {
                eventModel:'Event',
                isTeam: event.teamRequired,
                team: teamData?._id,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
              });
              toast.success("Registered successfully!");
              await update();
              router.push("/dashboard");
            } catch (err) {
              console.error("Registration API failed after payment:", err);
              toast.error("Registration failed after payment.");
            }
          },
          prefill: { name: "", email: "" },
          theme: { color: "#9333ea" },
        };

        new (window as any).Razorpay(options).open();
      } else {
        console.log("Free event detected, calling registration API directly...");
        await axios.post(`/api/registration/${eventId}`, {
            eventModel:'Event',
          isTeam: event.teamRequired,
          team: teamData?._id,
          orderId: "FREE_EVENT",
          paymentId: "FREE_EVENT",
        });
        toast.success("Registered successfully!");
        await update();
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Registration process failed:", err);
      toast.error("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111]">
        <ClipLoader color="#9333ea" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-[#1a1a2e] p-8 rounded-2xl shadow-lg border border-gray-800 space-y-6">
        <h1 className="text-3xl font-bold text-center text-[#9333ea]">
          Register for {event.title}
        </h1>
        <p className="text-center text-gray-400">
          {event.teamRequired
            ? `Team Event (${event.teamSize.min}-${event.teamSize.max} members)`
            : "Solo Event"}
        </p>

        {/* Team Join Input */}
        {event.teamRequired && !teamData && (
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="text"
              placeholder="Enter Team Code"
              value={joiningCode}
              onChange={(e) => setJoiningCode(e.target.value)}
              className="flex-1 p-3 rounded-md bg-[#111111] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#9333ea]"
            />
            <button
              onClick={handleJoinTeam}
              disabled={loading}
              className="bg-[#9333ea] hover:bg-[#7e22ce] py-3 px-6 rounded-md font-semibold transition-colors flex items-center justify-center"
            >
              {loading ? <ClipLoader color="black" size={20} /> : "Verify Team"}
            </button>
          </div>
        )}

        {/* Team Details */}
        {teamData && (
          <div className="bg-[#111111] p-6 rounded-xl border border-gray-700 space-y-6">
            <h3 className="font-semibold text-xl text-[#9333ea] text-center">
              Team Verified
            </h3>
            <p className="text-gray-300 text-center text-lg">
              Team Name: {teamData.name}
            </p>

            {/* Leader */}
            <div className="flex flex-col items-center mb-4">
              <img
                src={teamData.leader.profilePicture}
                alt={teamData.leader.fullName}
                className="w-24 h-24 rounded-full object-cover border-2 border-[#9333ea]"
              />
              <p className="mt-2 font-semibold text-white text-center">
                {teamData.leader.fullName}{" "}
                <span className="text-purple-300">(Leader)</span>
              </p>
              <p className="text-gray-400 text-sm text-center">
                {teamData.leader.username}
              </p>
            </div>

            {/* Members */}
            <div className="flex flex-wrap justify-center gap-6">
              {teamData.members.map((member) => (
                <div
                  key={member._id}
                  className="flex flex-col items-center bg-[#1c1c33] p-4 rounded-lg shadow-md w-36 sm:w-40"
                >
                  <img
                    src={member.profilePicture}
                    alt={member.fullName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                  />
                  <p className="mt-2 font-semibold text-center text-white">
                    {member.fullName}
                  </p>
                  <p className="text-gray-400 text-sm text-center">
                    {member.username}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registration Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-[#9333ea] hover:bg-[#7e22ce] py-3 rounded-md font-bold text-lg transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <ClipLoader color="black" size={20} />
          ) : (
            `Register ${
              event.registrationFee && event.registrationFee > 0
                ? `(₹${event.registrationFee})`
                : ""
            }`
          )}
        </button>
      </div>
    </div>
  );
}
