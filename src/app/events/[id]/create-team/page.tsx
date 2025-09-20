import TeamForm from "@/components/TeamForm";

interface PageProps {
  params: {
    id: string;
  };
}

export default function CreateEventTeamPage({ params }: PageProps) {
  return (
    <div>
      <TeamForm type="event" id={params.id} />
    </div>
  );
}
