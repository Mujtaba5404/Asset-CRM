import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import CanAccess from "../../components/CanAccess";
import DepreciationFormDrawer from "./DepreciationFormDrawer";

const AddDepreciationButton = ({ label = "New depreciation", ...props }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <CanAccess resource="depreciation" action="create">
      <DepreciationFormDrawer isOpen={opened} onClose={close} />

      <Button onClick={open} leftSection={<IconPlus size={16} />} {...props}>
        {label}
      </Button>
    </CanAccess>
  );
};

export default AddDepreciationButton;
