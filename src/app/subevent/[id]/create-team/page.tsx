
import TeamForm from "@/components/TeamForm";


export default function Page({ params }: any) {
  return (
    <div>
      <TeamForm type="subevent" id={params.id} />
    </div>
  );
}