import TeamForm from "@/components/TeamForm";

interface PageParams {
  id: string;
}
//changed
export default function CreateEventTeamPage({ params }: { params: PageParams }) {
  return (
    <div>
      <TeamForm type="event" id={params.id} />
    </div>
  );
}
