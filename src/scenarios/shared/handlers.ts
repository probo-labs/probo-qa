import { useState } from 'react';
import type { FocusEvent, ChangeEvent, MouseEvent } from 'react';
import type { ActionType } from '@/types/scenario';

export function useInteractionHandlers(onAction: (action: ActionType, element: string) => void) {
  const [interactedElements, setInteractedElements] = useState<Record<string, boolean>>({});

  const handleInteraction = (e: FocusEvent | ChangeEvent, actionType: ActionType) => {
    const elementId = e.currentTarget.id;
    if (elementId && !interactedElements[elementId]) {
      setInteractedElements(prev => ({ ...prev, [elementId]: true }));
      onAction(actionType, elementId);
    }
  };

  const handleFieldFocus = (e: FocusEvent) => handleInteraction(e, 'FILL');
  const handleFieldSelect = (e: ChangeEvent) => handleInteraction(e, 'SELECT');
  const handleButtonClick = (e: MouseEvent, elementId: string) => {
    e.preventDefault();
    if (!interactedElements[elementId]) {
      setInteractedElements(prev => ({ ...prev, [elementId]: true }));
      onAction('CLICK', elementId);
    }
  };

  return {
    handleFieldFocus,
    handleFieldSelect,
    handleButtonClick,
  };
}
