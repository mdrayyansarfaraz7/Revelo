import JoinTeamForm from "@/components/JoinTeamForm";



export default function Page({ params }: any) {
  return <JoinTeamForm type="event" id={params.id} />;
}
