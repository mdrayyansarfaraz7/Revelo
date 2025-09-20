import TeamForm from "@/components/TeamForm";

"use client";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <TeamForm type="subevent" id={params.id} />
    </div>
  );
}
