import TeamForm from "@/components/TeamForm";

interface Props {
  params: { id: string };
}

export default function page({ params }: Props) {
  return (
    <div>
      <TeamForm type="subevent" id={params.id} />
    </div>
  );
}