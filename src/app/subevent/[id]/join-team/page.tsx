import JoinTeamForm from "@/components/JoinTeamForm";


export default function JoinTeamSubEventPage({ params }: any) {
  return <JoinTeamForm type="subevent" id={params.id} />;
}
