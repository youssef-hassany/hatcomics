import { memo } from "react";

function NotificationHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Notifications</h1>
      <p className="text-zinc-400">Stay updated with your latest activity</p>
    </div>
  );
}

export default memo(NotificationHeader);
