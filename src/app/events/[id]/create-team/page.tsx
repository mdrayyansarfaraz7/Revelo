import TeamForm from "@/components/TeamForm";

"use client";

export default function CreateEventTeamPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <TeamForm type="event" id={params.id} />
    </div>
  );
}
