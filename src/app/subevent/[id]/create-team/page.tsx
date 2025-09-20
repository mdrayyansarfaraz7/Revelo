
import TeamForm from "@/components/TeamForm";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <div>
      <TeamForm type="subevent" id={params.id} />
    </div>
  );
}
