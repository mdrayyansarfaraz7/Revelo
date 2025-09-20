
import JoinTeamForm from "@/components/JoinTeamForm";

interface PageProps {
  params: {
    id: string;
  };
}

export default function JoinTeamSubEventPage({ params }: PageProps) {
  return <JoinTeamForm type="subevent" id={params.id} />;
}
