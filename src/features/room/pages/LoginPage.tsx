import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/AuthContext";
import { Button } from "@/ui/Button";
import { Card, CardTitle } from "@/ui/Card";
import { Input } from "@/ui/Input";

export function LoginPage() {
  const { setEmail } = useAuth();
  const [identity, setIdentityInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = identity.trim();
    if (!trimmed) {
      setError("Enter your name, nickname, or email");
      return;
    }
    if (trimmed.length > 128) {
      setError("Keep it under 128 characters");
      return;
    }
    setEmail(trimmed);
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardTitle className="mb-3">Who are you?</CardTitle>
        <p className="mb-4 text-xs text-dgg-muted">
          Enter your name, nickname, or email to join rooms and claim points.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Name, nickname, or email"
            value={identity}
            onChange={(e) => setIdentityInput(e.target.value)}
            autoComplete="username"
            autoFocus
            maxLength={128}
            aria-label="Your name, nickname, or email"
          />
          {error && (
            <p className="text-sm text-dgg-failed" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" aria-label="Continue">
            Continue
          </Button>
        </form>
      </Card>
    </div>
  );
}
