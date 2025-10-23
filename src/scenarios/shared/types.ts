import type { ActionType } from '@/types/scenario';

export interface ScenarioProps {
  onAction: (action: ActionType, element: string) => void;
}
