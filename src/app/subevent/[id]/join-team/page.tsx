import JoinTeamForm from "@/components/JoinTeamForm";

type Props = {
  params: {
    id: string;
  };
};

export default function JoinTeamSubEventPage({ params }: Props) {
  return <JoinTeamForm type="subevent" id={params.id} />;
}
