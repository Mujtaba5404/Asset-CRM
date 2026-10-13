import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import CanAccess from "../../components/CanAccess";
import DepreciationFormDrawer from "./DepreciationFormDrawer";

const EditDepreciationButton = ({ depreciation, label = "Edit", ...props }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <CanAccess resource="depreciation" action="update">
      <DepreciationFormDrawer depreciation={depreciation} isOpen={opened} onClose={close} />

      <Button variant="default" onClick={open} leftSection={<IconPencil size={16} />} {...props}>
        {label}
      </Button>
    </CanAccess>
  );
};

export default EditDepreciationButton;
