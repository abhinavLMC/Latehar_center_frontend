// pages/JoinCall.tsx
import React from "react";
import { useRouter } from "next/router";
import JoinCallPage from "@modules/ConsultationManagement/components/JoinCallPage"; // Adjust path as needed

const JoinCall: React.FC = () => {
  const router = useRouter();
  const { room_name } = router.query;

  if (!room_name || typeof room_name !== "string") {
    return <p>Loading...</p>;
  }
  
  return <JoinCallPage roomName={room_name} />;
};

export default JoinCall;
