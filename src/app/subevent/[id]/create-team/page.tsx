
"use client";
import TeamForm from "@/components/TeamForm";


export default function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <TeamForm type="subevent" id={params.id} />
    </div>
  );
}
