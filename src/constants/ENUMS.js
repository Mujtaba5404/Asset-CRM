const ENUMS = {
  ASSET: {
    STATUSES: {
      IN_USE: "in_use",
      BACKUP: "backup",
      MAINTENANCE: "maintenance",
      EXPIRED: "expired",
      DISPOSED: "disposed",
    },
  },
  MAINTENANCE: {
    STATUSES: {
      INITIATED: "initiated",
      COMPLETED: "completed",
    },
  },
  ORDER: {
    PAYMENT_TYPES: {
      NEW_ORDER: "new order",
      UPSALE: "upsale",
    },
  },
  TASK: {
    STATUSES: {
      OPEN: "open",
      CLOSED: "closed",
    },
  },
};

export default ENUMS;
