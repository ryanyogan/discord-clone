import { useEffect, useState } from "react";

export function useOrigin() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return "";
  }

  return typeof window !== "undefined" && window.location.origin;
}
