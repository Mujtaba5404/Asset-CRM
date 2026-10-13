import { Badge } from "@mantine/core";
import { getDepreciationMethod } from "./depreciationFormValues";

const DepreciationMethodBadge = ({ method, ...props }) => {
  const { label, color } = getDepreciationMethod(method);

  return (
    <Badge variant="light" color={color} tt="none" fw={500} {...props}>
      {label}
    </Badge>
  );
};

export default DepreciationMethodBadge;
