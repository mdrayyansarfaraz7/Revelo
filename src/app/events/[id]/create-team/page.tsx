
import TeamForm from "@/components/TeamForm";

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  return <TeamForm type="event" id={params.id} />;
}