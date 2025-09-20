"use client";
import TeamForm from "@/components/TeamForm";

export default function CreateEventTeamPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <TeamForm type="event" id={params.id} />
    </div>
  );
}
