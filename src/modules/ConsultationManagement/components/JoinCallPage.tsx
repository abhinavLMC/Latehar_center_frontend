// pages/JoinCallPage.tsx
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import DailyIframe, {
  DailyCall,
  DailyEventObjectParticipant,
  DailyParticipant,
  DailyEventObjectParticipantLeft,
} from "@daily-co/daily-js";
import { MOBILE_API_BASE_URL } from "@constants/ApiConstant";
import Toast from "@components/Common/Toast";

interface JoinCallPageProps {
  roomName: string;
}

const JoinCallPage: React.FC<JoinCallPageProps> = ({ roomName }) => {
  const router = useRouter();
  const { room_name, meet_link } = router.query;

  const callRef = useRef<DailyCall | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [participants, setParticipants] = useState<Record<string, DailyParticipant>>({});
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Preparing call...");

  // ✅ Fetch Daily token from backend
  const getToken = async (): Promise<string | null> => {
    try {
      console.log("[Token] Requesting token for room:", room_name);
      const response = await fetch(
        `${MOBILE_API_BASE_URL}/api/daily-video/generate-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomName: room_name,
            userName: "center",
          }),
        }
      );
      const data = await response.json();
      console.log("[Token] Response:", data);
      return data.token;
    } catch (error) {
      console.error("[Token] Error fetching Daily token:", error);
      return null;
    }
  };

  // ✅ Update participants state
  const updateParticipants = () => {
    if (callRef.current) {
      const allParticipants = callRef.current.participants();
      console.log("[Participants] Updated:", allParticipants);
      setParticipants({ ...allParticipants });
    }
  };

  // ✅ Join Daily Room
  const joinCall = async () => {
    if (!meet_link || typeof meet_link !== "string") {
      console.warn("[JoinCall] ❌ Invalid meet_link:", meet_link);
      return;
    }

    try {
      console.log("[JoinCall] 🚀 Starting join process. Room:", room_name, "Link:", meet_link);

      const token = await getToken();
      if (!token) throw new Error("No token received");

      // Cleanup any existing call
      if (callRef.current) {
        console.log("[JoinCall] ♻️ Cleaning up existing call before rejoining...");
        await callRef.current.leave();
        callRef.current.destroy();
        callRef.current = null;
      }

      // Create Daily call object
      console.log("[JoinCall] 🆕 Creating new call object...");
      const call = DailyIframe.createCallObject({
        subscribeToTracksAutomatically: true,
      });
      callRef.current = call;

      // Listen for events
      call.on("joined-meeting", () => {
        console.log("[Event] ✅ joined-meeting");
        setIsJoined(true);
        setStatusMessage("You joined the call.");
        updateParticipants();

        // Attach local video
        const local = call.participants().local;
        if (local?.tracks?.video?.track && localVideoRef.current) {
          console.log("[JoinCall] Attaching local video...");
          const stream = new MediaStream([local.tracks.video.track]);
          localVideoRef.current.srcObject = stream;
        }
      });

      call.on("participant-joined", (ev: DailyEventObjectParticipant) => {
        console.log("[Event] 👥 participant-joined:", ev.participant.session_id);
        updateParticipants();
      });
      
      call.on("participant-updated", (ev: DailyEventObjectParticipant) => {
        console.log("[Event] 🔄 participant-updated:", ev.participant.session_id);
        updateParticipants();
      });
      
      call.on("participant-left", (ev: DailyEventObjectParticipantLeft) => {
        console.log("[Event] ❌ participant-left:", ev.participant.session_id);
        updateParticipants();
      });

      call.on("left-meeting", () => {
        console.log("[Event] 👋 left-meeting");
        setIsJoined(false);
        setStatusMessage("You left the call.");
        setParticipants({});
        router.push("/consultation-management");
      });

      // call.on("error", (e) => {
      //   console.error("[Event] ❌ Daily error:", e);
      //   setStatusMessage(`Error: ${e.errorMsg || "Unknown"}`);
      // });

      call.on("error", (e) => {
        console.error("[Event] ❌ Daily error:", e);
      
        if (e.errorMsg?.toLowerCase().includes("expired")) {
          Toast("info","","This consultation room has expired.");
        } else if (e.errorMsg?.toLowerCase().includes("not found")) {
          Toast("info","","This consultation room does not exist anymore.");
        } else {
          Toast("info","",`${e.errorMsg || "Unknown error"}`);
        }
      
        setStatusMessage("Failed to join call.");
        router.push("/consultation-management");
      });
      

      // Join room
      console.log("[JoinCall] 📞 Joining room with token...");
      await call.join({ url: meet_link, token });

      console.log("[JoinCall] 🎥 Starting local camera...");
      await call.startCamera();
    } catch (err) {
      console.error("[JoinCall] ❌ Failed to join call:", err);
      setStatusMessage("Failed to join call.");
    }
  };

  // ✅ Leave Call
  const leaveCall = async () => {
    console.log("[LeaveCall] 🚪 Leaving call...");
    if (callRef.current) {
      await callRef.current.leave();
      callRef.current.destroy();
      callRef.current = null;
    }
    setIsJoined(false);
    router.push("/consultation-management");
  };

  // ✅ Toggle Mute
  const toggleMute = async () => {
    if (callRef.current) {
      const newMuted = !isMuted;
      console.log(`[Mute] Toggling. New state: ${newMuted ? "Muted" : "Unmuted"}`);
      await callRef.current.setLocalAudio(!newMuted);
      setIsMuted(newMuted);
    } else {
      console.warn("[Mute] ⚠️ No active callRef found.");
    }
  };

  // ✅ Lifecycle
  useEffect(() => {
    console.log("[useEffect] 🔄 Room changed. Joining:", room_name);
    joinCall();

    return () => {
      console.log("[Cleanup] 🔚 Component unmounting...");
      if (callRef.current) {
        callRef.current.leave();
        callRef.current.destroy();
        callRef.current = null;
        console.log("[Cleanup] ✅ Call destroyed.");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room_name]);

  const remoteParticipants = Object.values(participants).filter((p) => !p.local);

  // return (
  //   <div style={styles.container}>
  //     {/* Remote Participants */}
  //     <div style={styles.videoGrid}>
  //       {remoteParticipants.map((p) => {
  //         const videoTrack = p.tracks.video?.track;
  //         return (
  //           <video
  //             key={p.session_id}
  //             autoPlay
  //             playsInline
  //             ref={(el) => {
  //               if (videoTrack && el) {
  //                 console.log("[Render] Attaching remote video:", p.session_id);
  //                 const stream = new MediaStream([videoTrack]);
  //                 el.srcObject = stream;
  //               }
  //             }}
  //             style={styles.remoteVideo}
  //           />
  //         );
  //       })}
  //     </div>

  //     {/* Local Video */}
  //     <video ref={localVideoRef} autoPlay muted playsInline style={styles.localVideo} />

  //     {/* Controls */}
  //     <div style={styles.controls}>
  //       {isJoined ? (
  //         <>
  //           <button style={styles.button} onClick={toggleMute}>
  //             {isMuted ? "Unmute" : "Mute"}
  //           </button>
  //           <button
  //             style={{ ...styles.button, backgroundColor: "#f44336" }}
  //             onClick={leaveCall}
  //           >
  //             End Call
  //           </button>
  //         </>
  //       ) : (
  //         <p style={{ color: "#fff" }}>{statusMessage}</p>
  //       )}
  //     </div>
  //   </div>
  // );

  return (
    <div style={styles.container}>
      {/* Remote Participants */}
      <div style={styles.videoGrid}>
      {remoteParticipants.map((p) => {
  const videoTrack = p.tracks.video?.track;
  const audioTrack = p.tracks.audio?.track;

  return (
    <div key={p.session_id} style={styles.participantTile}>
      {/* Remote Video */}
      <video
        autoPlay
        playsInline
        ref={(el) => {
          if (videoTrack && el) {
            const stream = new MediaStream([videoTrack]);
            el.srcObject = stream;
          }
        }}
        style={styles.remoteVideo}
      />

      {/* Remote Audio */}
      <audio
        autoPlay
        playsInline
        ref={(el) => {
          if (audioTrack && el) {
            const stream = new MediaStream([audioTrack]);
            el.srcObject = stream;
          }
        }}
      />

      {/* Mute icon */}
      {p.tracks.audio?.state === "off" && (
        <div style={styles.muteIcon}>🔇</div>
      )}
    </div>
  );
})}

      </div>
  
      {/* Local Video */}
<div style={styles.localVideoWrapper}>
  <video
    ref={localVideoRef}
    autoPlay
    muted
    playsInline
    style={styles.localVideo}
  />
  {isMuted && <div style={styles.muteIcon}>🔇</div>}
</div>

  
      {/* Controls */}
      <div style={styles.controls}>
        {isJoined ? (
          <>
            <button style={styles.button} onClick={toggleMute}>
              {isMuted ? "Unmute" : "Mute"}
            </button>
            <button
              style={{ ...styles.button, backgroundColor: "#f44336" }}
              onClick={leaveCall}
            >
              End Call
            </button>
          </>
        ) : (
          <p style={{ color: "#fff" }}>{statusMessage}</p>
        )}
      </div>
    </div>
  );
  
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "relative",
    width: "100%",
    height: "100vh",
    backgroundColor: "#000",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  videoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "8px",
    padding: "10px",
    boxSizing: "border-box",
    alignItems: "center",     // vertically center videos
    justifyItems: "center",   // horizontally center videos
  },
  
  remoteVideo: {
    width: "100%",
    height: "auto",          // let height adjust to maintain aspect
    maxHeight: "100%",       // don’t overflow container
    objectFit: "contain",    // no zoom/crop, maintain full video frame
    borderRadius: 8,
    backgroundColor: "#000",
    aspectRatio: "16/9",     // keep widescreen format
    justifySelf: "center",   // center in grid cell
  },
  
  // localVideo: {
  //   position: "absolute",
  //   bottom: 20,
  //   right: 20,
  //   width: "20vw", // responsive width (20% of viewport)
  //   maxWidth: 220,
  //   minWidth: 120,
  //   aspectRatio: "16/9",
  //   borderRadius: 8,
  //   zIndex: 10,
  //   backgroundColor: "#333",
  //   border: "2px solid white",
  // },
  controls: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexWrap: "wrap", // wrap buttons on mobile
    justifyContent: "center",
    gap: 12,
    zIndex: 20,
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    flexShrink: 0, // buttons don’t shrink too much
  },

  participantTile: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
  
  participantTileLocal: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: "20vw",
    maxWidth: 220,
    minWidth: 120,
    aspectRatio: "16/9",
    borderRadius: 8,
    backgroundColor: "#333",
    border: "2px solid white",
    zIndex: 10,
    overflow: "hidden",
  },
  
  // muteIcon: {
  //   position: "absolute",
  //   top: 8,
  //   right: 8,
  //   backgroundColor: "rgba(0,0,0,0.6)",
  //   color: "#fff",
  //   padding: "4px 6px",
  //   borderRadius: "50%",
  //   fontSize: "16px",
  // },

  localVideoWrapper: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: "20vw",
    maxWidth: 220,
    minWidth: 120,
    aspectRatio: "16/9",
    borderRadius: 8,
    backgroundColor: "#333",
    border: "2px solid white",
    zIndex: 10,
    overflow: "hidden",
  },
  
  localVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 8,
  },
  
  muteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    padding: "4px 6px",
    borderRadius: "50%",
    fontSize: "16px",
    zIndex: 20, // ensure it's on top of video
  },
  
  
};

export default JoinCallPage;
