import { toast } from "sonner";

/** Explain a frontend-only action without suggesting that anything was persisted. */
export function showServerStub(feature: string, futureBehavior: string) {
  toast.info(`${feature} — frontend preview`, {
    description: `${futureBehavior} Nothing has been saved or sent yet; this will work when the server is connected.`,
    duration: 6500,
  });
}
