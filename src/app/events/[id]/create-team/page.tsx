
import TeamForm from "@/components/TeamForm";


export default function Page({ params }: any) {
  return <TeamForm type="event" id={params.id} />;
}