type EventParams = Record<string, string | number | boolean | null | undefined>;

type GtagFunction = (
  command: "event",
  eventName: string,
  eventParams?: Record<string, unknown>,
) => void;

type UmamiFunction = (eventName: string, eventData?: Record<string, unknown>) => void;

type UmamiObject = {
  track?: UmamiFunction;
};

declare global {
  interface Window {
    gtag?: GtagFunction;
    umami?: UmamiFunction | UmamiObject;
  }
}

function toSerializableParams(eventParams: EventParams): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(eventParams).filter(([, value]) => value !== undefined),
  );
}

export function trackEvent(eventName: string, eventParams: EventParams = {}): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload = toSerializableParams(eventParams);

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }

  if (typeof window.umami === "function") {
    window.umami(eventName, payload);
    return;
  }

  if (window.umami && typeof window.umami.track === "function") {
    window.umami.track(eventName, payload);
  }
}