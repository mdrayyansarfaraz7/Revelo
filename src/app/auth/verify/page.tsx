import { Suspense } from "react";
import VerifyCode from "@/components/VerifyCode";
import { ClipLoader } from "react-spinners";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white text-center py-10"><ClipLoader size={60} color="#8E24AA"/></div>}>
      <VerifyCode />
    </Suspense>
  );
}
