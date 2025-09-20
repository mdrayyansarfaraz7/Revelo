
import TeamForm from "@/components/TeamForm";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <TeamForm type="event" id={params.id} />;
}
