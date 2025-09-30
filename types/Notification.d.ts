export type IndividualNotification = {
  id: string;
  type: NotificationType;
  entityType: EntityType;
  entityId: string;
  message: string;
  readAt: Date | null;
  createdAt: Date;
  actor: {
    id: string;
    username: string;
    photo: string | null;
  };
  batchCount: number;
  isRead: boolean;
  url: string;
};

export type BroadcastNotification = {
  id: string;
  title: string;
  content: string;
  type: BroadcastType;
  createdAt: Date;
  isRead: boolean;
  targetCriteria: any;
  url: string;
};

export type NotificationsData = {
  individual: IndividualNotification[];
  broadcast: BroadcastNotification[];
};
