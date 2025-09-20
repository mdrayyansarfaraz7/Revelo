"use client";
import JoinTeamForm from "@/components/JoinTeamForm";

"use client";

export default function JoinTeamSubEventPage({ params }: { params: { id: string } }) {
  return <JoinTeamForm type="subevent" id={params.id} />;
}
