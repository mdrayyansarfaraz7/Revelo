import JoinTeamForm from "@/components/JoinTeamForm";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <JoinTeamForm type="event" id={params.id} />;
}