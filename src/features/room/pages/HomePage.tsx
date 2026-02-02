import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, LogIn, Plus } from "lucide-react";
import { useAuth } from "@/app/AuthContext";
import { API } from "@/app/api/endpoints";
import { apiFetch } from "@/app/api/client";
import { useToast } from "@/ui/Toast";
import { Button } from "@/ui/Button";
import { Card, CardTitle } from "@/ui/Card";
import { Input } from "@/ui/Input";
import type { RoomSummary } from "@/app/api/types";

export function HomePage() {
  const navigate = useNavigate();
  const { email, logout } = useAuth();
  const { addToast } = useToast();
  const [createName, setCreateName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = createName.trim();
    if (!name || name.length < 3 || name.length > 18) {
      addToast("error", "Room name must be 3–18 characters");
      return;
    }
    setCreating(true);
    try {
      const data = await apiFetch<RoomSummary>(API.room.create, {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      addToast("success", `Room "${data.name}" created`);
      navigate(`/room/${data.code}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create room";
      addToast("error", message);
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    if (!code || code.length < 4 || code.length > 5) {
      addToast("error", "Room code must be 4–5 characters");
      return;
    }
    setJoining(true);
    try {
      await apiFetch(API.room.join, {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      addToast("success", "Joined room");
      navigate(`/room/${code}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to join room";
      addToast("error", message);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen p-6 text-zinc-100">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="text-center">
          <h1 className="font-display text-4xl tracking-wide text-dgg-yellow-dark drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] [-webkit-text-stroke:3px_rgba(0,0,0,0.95)] sm:text-5xl">
            Operation X
          </h1>
          <p className="mt-2 font-display text-lg tracking-wider text-dgg-yellow/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            Secret missions. Don&apos;t get got.
          </p>
          <p className="mt-4 max-w-md mx-auto text-sm text-zinc-200">
            A mission-based game for in-person team gatherings: create a room or join with a code, then try to apply each mission to someone. If you achieve it, click <strong>Got</strong> (green); if not, click <strong>Failed</strong> (red). In both cases assign who got got. Only Got scores points.
          </p>
          {email && (
            <p className="mt-4">
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-xs text-zinc-300 underline hover:text-zinc-100 transition-colors"
                aria-label="Log out"
              >
                <LogOut className="mr-1.5 inline h-3 w-3 align-middle" />
                Not you? Log out
              </button>
            </p>
          )}
        </header>

        <Card className="border-dgg-border/50 bg-dgg-surface/95">
          <CardTitle className="mb-2 text-base">How it works</CardTitle>
          <ul className="space-y-1.5 text-sm text-zinc-200">
            <li>• Create or join a room and share the code. Play in person at your gathering.</li>
            <li>• You get <strong>1 common mission</strong> (same for everyone) and <strong>5 personal missions</strong>.</li>
            <li>• Try to apply each mission to someone. If you achieve it, click <strong>Got</strong> (green); if you fail, click <strong>Failed</strong> (red).</li>
            <li>• In both cases assign <strong>who got got</strong> (the person the mission was for). Only Got scores points.</li>
            <li>• Highest score wins. The creator can close the room when you&apos;re done.</li>
          </ul>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardTitle className="mb-3">Start an Operation</CardTitle>
            <p className="mb-4 text-xs text-dgg-muted">
              Create a room with a short name (3–18 chars). You&apos;ll get a 4-character code.
            </p>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                type="text"
                placeholder="Room name"
                minLength={3}
                maxLength={18}
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                disabled={creating}
                aria-label="Room name"
              />
              <Button type="submit" disabled={creating} aria-label="Create room">
                <Plus className="h-4 w-4" />
                Create room
              </Button>
            </form>
          </Card>

          <Card>
            <CardTitle className="mb-3">Enter a Safehouse</CardTitle>
            <p className="mb-4 text-xs text-dgg-muted">
              Join an existing room with the 4–5 character code.
            </p>
            <form onSubmit={handleJoin} className="space-y-4">
              <Input
                type="text"
                placeholder="Room code"
                minLength={4}
                maxLength={5}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                disabled={joining}
                className="font-mono uppercase"
                aria-label="Room code"
              />
              <Button type="submit" variant="secondary" disabled={joining} aria-label="Join room">
                <LogIn className="h-4 w-4" />
                Join room
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
