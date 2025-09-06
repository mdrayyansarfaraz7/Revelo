import JoinTeamForm from "@/components/JoinTeamForm";

export default function JoinTeamSubEventPage({ params }: { params: { id: string } }) {
  return <JoinTeamForm type="subevent" id={params.id} />;
}
