import JoinTeamForm from "@/components/JoinTeamForm";

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  return <JoinTeamForm type="event" id={params.id} />;
}
