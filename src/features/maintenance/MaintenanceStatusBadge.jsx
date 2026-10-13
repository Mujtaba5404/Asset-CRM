import { Badge } from "@mantine/core";
import { getMaintenanceStatusOption } from "./maintenanceForm";

const MaintenanceStatusBadge = ({ status, size = "sm", ...props }) => {
  const option = getMaintenanceStatusOption(status);

  if (!option) {
    return (
      <Badge size={size} variant="light" color="gray" tt="capitalize" {...props}>
        {status || "—"}
      </Badge>
    );
  }

  const Icon = option.icon;

  return (
    <Badge size={size} variant="light" color={option.color} tt="none" leftSection={<Icon size={12} stroke={2} />} {...props}>
      {option.label}
    </Badge>
  );
};

export default MaintenanceStatusBadge;
