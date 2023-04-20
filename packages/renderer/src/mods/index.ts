import { AutoGroupMod } from './auto-group'
import { ChallengePercentMod } from './challenge-percent'
import { DamageEstimatorMod } from './damage-estimator'
import { FightChronometerMod } from './fight-chronometer'
import { GENERAL_MODS } from './general'
import { GripPositionSaveMod } from './grip-position-save'
import { HarvestBarMod } from './harvest-bar'
import { HealthBarMod } from './health-bar'
import { JobXPMod } from './job-xp'
import { NotificationsMod } from './notifications'
import { PartyInfoMod, PartyMemberMod } from './party-info'
import { RapidExchangeMod } from './rapid-exchange'
import { RuneListerMod } from './rune-lister'
import { ShortcutsMod } from './shortcuts'
import { ShowResourcesMod } from './show-resources'
import { VerticalTimelineMod } from './vertical-timeline'
import { ZaapSearchFilterMod } from './zaap-search-filter'
import { RecipePrice } from './recipe-price'
import { OffensiveMonsters } from '@/mods/ofensive monsters'
import { DebugMessagesMod } from '@/mods/debug message helper'

export * from './shortcuts'
export * from './notifications'
export * from './damage-estimator'
export * from './challenge-percent'
export * from './health-bar'
export * from './fight-chronometer'
export * from './vertical-timeline'
export * from './general'
export * from './grip-position-save'
export * from './harvest-bar'
export * from './job-xp'

export const MODS = [
  ShortcutsMod,
  NotificationsMod,
  DamageEstimatorMod,
  ChallengePercentMod,
  HealthBarMod,
  FightChronometerMod,
  VerticalTimelineMod,
  GripPositionSaveMod,
  HarvestBarMod,
  JobXPMod,
  AutoGroupMod,
  PartyMemberMod,
  PartyInfoMod,
  RapidExchangeMod,
  RuneListerMod,
  ShowResourcesMod,
  ZaapSearchFilterMod,
  RecipePrice,
  OffensiveMonsters,
  DebugMessagesMod,
  ...GENERAL_MODS
] as const
