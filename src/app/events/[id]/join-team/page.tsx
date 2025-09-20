import JoinTeamForm from "@/components/JoinTeamForm";

"use client";


export default function Page({ params }: { params: { id: string } }) {
  return <JoinTeamForm type="event" id={params.id} />;
}