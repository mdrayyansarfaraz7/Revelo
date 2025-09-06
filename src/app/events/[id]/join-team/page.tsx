import JoinTeamForm from "@/components/JoinTeamForm";

export default function page({ params }: { params: { id: string } }) {
  return <JoinTeamForm type="event" id={params.id} />;
}