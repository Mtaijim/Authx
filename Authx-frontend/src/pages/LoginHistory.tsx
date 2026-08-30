import { useEffect, useState } from "react";
import apiClient from "@/config/ApiCient";
import { Badge, Clock, Globe, Monitor, Shield, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LoginEvents = {
  id: string;
  ipAddress: string;
  device: string;
  os: string;
  status: "SUCCESS" | "FAILURE";
  failedReason: string | null;
  createdAt: number;
};

export const LoginHistory = () => {
  const [events, setEvents] = useState<LoginEvents[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/auth/history")
      .then((res) => {
        console.log("History response:", res.data);
        console.log("Length:", res.data.length);
        setEvents(res.data);
      })
      .catch((err) => {
        console.error("History error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

    return date.toLocaleString("en-Us", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const DeviceIcon = ({ device }: { device: string }) => {
    const isMobile =
      device.includes("Mobile") ||
      device.includes("iphone") ||
      device.includes("Android");
    return isMobile ? (
      <Smartphone className="w-4 h-4" />
    ) : (
      <Monitor className="w-4 h-4" />
    );
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted border-t-primary" />
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <CardTitle>Login History</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Last 20 login attempts on your account
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* empty state */}
          {events.length === 0 && (
            <div className="text-center py-12">
              <Globe className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No login history yet</p>
            </div>
          )}

          {/* login event cards */}
          {events.map((event) => (
            <div
              key={event.id}
              className={`
                flex items-center justify-between
                p-4 rounded-xl border transition-colors
                ${
                  event.status === "SUCCESS"
                    ? "bg-card border-border"
                    : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900"
                }
              `}
            >
              {/* left side — icon + device info */}
              <div className="flex items-center gap-3">
                <div
                  className={`
                  w-9 h-9 rounded-lg flex items-center
                  justify-center flex-shrink-0
                  ${
                    event.status === "SUCCESS"
                      ? "bg-primary/10 text-primary"
                      : "bg-red-100 text-red-600 dark:bg-red-900/30"
                  }
                `}
                >
                  <DeviceIcon device={event.device} />
                </div>

                <div>
                  {/* device + OS */}
                  <p className="text-sm font-medium">
                    {event.device} · {event.os}
                  </p>

                  {/* IP + failure reason */}
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground font-mono">
                      {event.ipAddress}
                    </p>
                    {event.failedReason && (
                      <p className="text-xs text-red-500">
                        ·{event.failedReason}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* right side — badge + time */}
              <div className="flex flex-col items-end gap-1.5">
                <Badge
                  type={
                    event.status === "SUCCESS" ? "secondary" : "destructive"
                  }
                  className="text-xs"
                >
                  {event.status === "SUCCESS" ? "✓ Success" : "✕ Failed"}
                </Badge>

                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatTime(event.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
