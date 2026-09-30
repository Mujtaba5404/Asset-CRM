import { Badge, Tooltip } from "@mantine/core";
import {
  IconShieldCheck,
  IconShieldExclamation,
  IconShieldOff,
} from "@tabler/icons-react";
import formatDate from "../../utils/formatDate";
import { daysUntil, describeDueDate, formatDayCount } from "../../utils/dateValue";

export const WARRANTY_EXPIRY_WINDOW_DAYS = 60;

/**
 * Warranty state as a badge. The icon carries the state alongside the colour, so
 * "expiring" is never signalled by hue alone.
 */
const AssetWarrantyBadge = ({ warranty, size = "sm" }) => {
  if (!warranty?.hasWarranty) {
    return (
      <Badge
        size={size}
        variant="light"
        color="gray"
        leftSection={<IconShieldOff size={12} />}
      >
        No warranty
      </Badge>
    );
  }

  const remaining = daysUntil(warranty.endDate);

  if (remaining === null) {
    return (
      <Badge
        size={size}
        variant="light"
        color="teal"
        leftSection={<IconShieldCheck size={12} />}
      >
        Covered
      </Badge>
    );
  }

  if (remaining < 0) {
    return (
      <Tooltip
        label={`Warranty ended ${formatDate(warranty.endDate)}`}
        withArrow
      >
        <Badge
          size={size}
          variant="light"
          color="red"
          leftSection={<IconShieldOff size={12} />}
        >
          Expired
        </Badge>
      </Tooltip>
    );
  }

  if (remaining <= WARRANTY_EXPIRY_WINDOW_DAYS) {
    return (
      <Tooltip
        label={`Warranty ends ${formatDate(warranty.endDate)} (${describeDueDate(warranty.endDate)})`}
        withArrow
      >
        <Badge
          size={size}
          variant="light"
          color="orange"
          leftSection={<IconShieldExclamation size={12} />}
        >
          {formatDayCount(remaining)} left
        </Badge>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={`Covered until ${formatDate(warranty.endDate)}`} withArrow>
      <Badge
        size={size}
        variant="light"
        color="teal"
        leftSection={<IconShieldCheck size={12} />}
      >
        Covered
      </Badge>
    </Tooltip>
  );
};

export default AssetWarrantyBadge;
