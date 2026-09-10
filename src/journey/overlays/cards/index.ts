import type { ComponentType } from "react";
import { AnalyticsCard } from "./AnalyticsCard";
import { CompleteCard } from "./CompleteCard";
import { GpsFailsCard } from "./GpsFailsCard";
import { IndustriesCard } from "./IndustriesCard";
import { MappingCard } from "./MappingCard";
import { VpsCard } from "./VpsCard";
import { WelcomeCard } from "./WelcomeCard";

/** Registry of destination cards keyed by JOURNEY_NODES id. */
export const DESTINATION_CARDS: Record<string, ComponentType> = {
  welcome: WelcomeCard,
  "gps-fails": GpsFailsCard,
  vps: VpsCard,
  mapping: MappingCard,
  analytics: AnalyticsCard,
  industries: IndustriesCard,
  complete: CompleteCard,
};

export {
  AnalyticsCard,
  CompleteCard,
  GpsFailsCard,
  IndustriesCard,
  MappingCard,
  VpsCard,
  WelcomeCard,
};
