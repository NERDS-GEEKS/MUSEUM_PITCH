import {
  closeDestinationDetail,
  getDestinationDetail,
  openDestinationDetail,
  subscribeDestinationDetail,
} from "@/journey/overlays/destinationDetailStore";
import {
  createContext,
  createElement,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type DestinationDetailApi = {
  openId: string | null;
  open: (id: string) => void;
  close: () => void;
  isOpen: boolean;
};

const DestinationDetailContext = createContext<DestinationDetailApi | null>(
  null,
);

export function DestinationDetailProvider({
  children,
}: {
  children: ReactNode;
}) {
  const openId = useSyncExternalStore(
    subscribeDestinationDetail,
    () => getDestinationDetail().openId,
    () => getDestinationDetail().openId,
  );

  const api = useMemo<DestinationDetailApi>(
    () => ({
      openId,
      open: openDestinationDetail,
      close: closeDestinationDetail,
      isOpen: openId != null,
    }),
    [openId],
  );

  return createElement(
    DestinationDetailContext.Provider,
    { value: api },
    children,
  );
}

export function useDestinationDetail(): DestinationDetailApi {
  const ctx = useContext(DestinationDetailContext);
  if (!ctx) {
    throw new Error(
      "useDestinationDetail requires DestinationDetailProvider",
    );
  }
  return ctx;
}

/** Safe for R3F bridges that may read store without React context. */
export function useDestinationDetailOpenId(): string | null {
  return useSyncExternalStore(
    subscribeDestinationDetail,
    () => getDestinationDetail().openId,
    () => getDestinationDetail().openId,
  );
}
