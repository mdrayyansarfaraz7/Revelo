import TeamForm from "@/components/TeamForm";

interface Props {
  params: { id: string };
}

export default function CreateEventTeamPage({ params }: Props) {
  return (
    <div>
      <TeamForm type="event" id={params.id} />
    </div>
  );
}
