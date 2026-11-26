export type RankBadge = {
  kind: "rank";
  tierId: number;
};

export type SpecialBadge = {
  kind: "special";
  url: string;
  title: string;
};

export type ActiveBadge = RankBadge | SpecialBadge;

export type RawBadge = {
  isApplied: boolean;
  badgeDefinition: {
    title: string;
    url: string;
  };
};
