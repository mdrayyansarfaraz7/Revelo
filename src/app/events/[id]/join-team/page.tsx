"use client";
import JoinTeamForm from "@/components/JoinTeamForm";




export default function Page({ params }: { params: { id: string } }) {
  return <JoinTeamForm type="event" id={params.id} />;
}