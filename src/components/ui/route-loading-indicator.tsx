"use client";

type RouteLoadingIndicatorProps = {
  isLoading: boolean;
};

export function RouteLoadingIndicator({ isLoading }: RouteLoadingIndicatorProps) {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="route-loading">
      <span />
    </div>
  );
}