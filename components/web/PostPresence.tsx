"use client";

import usePresence from "@convex-dev/presence/react";
import FacePile from "@convex-dev/presence/facepile";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface iAppProps {
  roomId: Id<"posts">;
  userId: string;
}
export function PostPresence({ roomId, userId }: iAppProps) {
  const presenceState = usePresence(api.presence, roomId, userId);

  if (presenceState?.length === 0 || !presenceState) return null;
  return (
    <div className="flex items-center gap-2">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">
        Viewing now
      </p>
      <div className="text-foreground">
        <FacePile presenceState={presenceState} />
      </div>
    </div>
  );
}
