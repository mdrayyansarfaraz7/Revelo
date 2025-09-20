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

interface SubEvent {
  _id: string;
  title: string;
  category: string;
  banner: string;
  price?: number;
  teamRequired: boolean;
  teamSize: { min: number; max: number };
}

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const subEventId = params.id as string;
  

  const [subEvent, setSubEvent] = useState<SubEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [joiningCode, setJoiningCode] = useState("");
  const [teamData, setTeamData] = useState<TeamData | null>(null);
const { update } = useSession();
const { data: session } = useSession();
  // Fetch subevent details
  useEffect(() => {
    const fetchSubEvent = async () => {
      try {
        const res = await axios.get(`/api/sub-events/${subEventId}`);
        setSubEvent(res.data.subevent);
      } catch {
        toast.error("Failed to load subevent.");
      }
    };
    if (subEventId) fetchSubEvent();
  }, [subEventId]);

  // Join team handler
  const handleJoinTeam = async () => {
    if (!joiningCode) return toast.error("Enter team code!");
    try {
      setLoading(true);
      const res = await axios.post(`/api/team/verify`, {
        joiningCode,
        subEventId,
        eventModel:"SubEvent"
      });
      setTeamData(res.data.team);
      toast.success("Team verified!");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Team verification failed.");
    } finally {
      setLoading(false);
    }
  };

  
const handleRegister = async () => {
  
  try {
    const res = await axios.get("/api/registration/check", {
      params: {
        subEventId,
        teamId: subEvent?.teamRequired ? teamData?._id : undefined,
        userId: !subEvent?.teamRequired ? session?.user.id : undefined,
      },
    });

    console.log(res);

    if (res.data.registered) {
      return toast.error("You or your team are already registered!");
    }
  } catch (err) {
    return toast.error("Failed to verify registration.");
  }

  // 2️⃣ Existing logic
  if (subEvent?.teamRequired && !teamData) {
    return toast.error("Please join a valid team first.");
  }

  try {
    setLoading(true);

    if (subEvent?.price && subEvent.price > 0) {
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        toast.error("Failed to load Razorpay SDK");
        return;
      }

      const orderRes = await axios.post("/api/payment/create-order", {
        amount: subEvent.price * 100,
      });
      const { order } = orderRes.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: "INR",
        name: "Revelo",
        image: "/favicon.png",
        description: `Registration for ${subEvent?.title}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            await axios.post(`/api/registration/${subEventId}`, {
              eventModel: "SubEvent",
              isTeam: subEvent.teamRequired,
              team: teamData?._id,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
            });
            toast.success("Registered successfully!");
            router.push("/dashboard");
          } catch {
            toast.error("Registration failed after payment.");
          }
        },
        theme: { color: "#9333ea" },
      };

      new (window as any).Razorpay(options).open();
    } else {
      // Free subEvent
      await axios.post(`/api/registration/${subEventId}`, {
        eventModel: "SubEvent",
        isTeam: subEvent?.teamRequired,
        team: teamData?._id,
        orderId: "FREE_EVENT",
        paymentId: "FREE_EVENT",
      });
      toast.success("Registered successfully!");
      await update();
      router.push("/dashboard");
    }
  } catch {
    toast.error("Registration failed.");
  } finally {
    setLoading(false);
  }
};


  if (!subEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111111]">
        <ClipLoader color="#9333ea" size={40} />
      </div>
    );
  }

  const isTeamEvent = subEvent.teamRequired;

  return (
    <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-[#1a1a2e] p-8 rounded-2xl shadow-lg border border-gray-800 space-y-6">
        <h1 className="text-3xl font-bold text-center text-[#9333ea]">
          Register for {subEvent.title}
        </h1>
        <p className="text-center text-gray-400">
          {isTeamEvent
            ? `Team Event (${subEvent.teamSize.min}-${subEvent.teamSize.max} members)`
            : "Solo Event"}
        </p>

        {/* Team Join Input */}
        {isTeamEvent && !teamData && (
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
            `Register ${subEvent.price && subEvent.price > 0 ? `(₹${subEvent.price})` : ""}`
          )}
        </button>


      </div>
    </div>
  );
}
