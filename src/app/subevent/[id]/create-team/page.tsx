// app/events/[id]/create-team/page.tsx
import TeamForm from "@/components/TeamForm";

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  return (
    <div>
      <TeamForm type="subevent" id={params.id} />
    </div>
  );
}