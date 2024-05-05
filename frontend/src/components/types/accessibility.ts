export type AccessibilityType = {
  cardscontainerref?: HTMLDivElement | null | undefined;
  refreshundoredoclosecontainerref?: HTMLDivElement | null | undefined;
  refreshundoredoclosetabindex?: boolean | null | undefined;
  cardsref?: HTMLDivElement[] | [] | undefined;
  cardstabindex?: boolean[] | [] | undefined;
  cardschildrentabindex?: boolean[] | [] | undefined;
  cardsmultiplesearchopenstatus?: boolean[] | [] | undefined;
  cardsfilteritemtabindex?: boolean[] | [] | undefined;
  updateAccessibility: () => void;
};

