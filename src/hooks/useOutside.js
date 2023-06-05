import { useEffect } from "react";

export default function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listner = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      if (event.key === "Escape") {
        handler();
        return;
      }
      handler();
    };
    document.addEventListener("mousedown", listner);
    document.addEventListener("touchstart", listner);
    document.addEventListener("keydown", listner);
    return () => {
      document.removeEventListener("mousedown", listner);
      document.removeEventListener("touchstart", listner);
      document.removeEventListener("keydown", listner);
    };
  }, [ref, handler]);
}
