import { Copy, Lock } from "lucide-react";
import { useToast } from "@/ui/Toast";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import type { RoomMeta } from "@/app/api/types";

interface RoomHeaderProps {
  room: RoomMeta;
}

export function RoomHeader({ room }: RoomHeaderProps) {
  const { addToast } = useToast();

  const copyCode = () => {
    navigator.clipboard.writeText(room.code);
    addToast("success", "Room code copied");
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <h1 className="font-display text-2xl tracking-wide text-dgg-lime">{room.name}</h1>
      <Badge variant="default" className="font-mono text-sm">
        {room.code}
      </Badge>
      <Button
        type="button"
        variant="ghost"
        onClick={copyCode}
        aria-label="Copy room code"
      >
        <Copy className="h-4 w-4" />
        Copy
      </Button>
      {room.isClosed && (
        <Badge variant="muted" className="flex items-center gap-1">
          <Lock className="h-3 w-3" />
          Closed
        </Badge>
      )}
    </div>
  );
}
