// import { Button } from "@mantine/core";
// import { useDisclosure } from "@mantine/hooks";
// import { IconPlus } from "@tabler/icons-react";
// import CanAccess from "../../components/CanAccess";
// import AddAssetModal from "./AddAssetModal";

// const AddAssetModalButton = () => {
//   const [addAssetModalOpened, { open: openAddAssetModal, close: closeAddAssetModal }] = useDisclosure(false);

//   return (
//     <CanAccess resource="asset" action="create">
//       <AddAssetModal isOpen={addAssetModalOpened} onClose={closeAddAssetModal} />

//       <Button onClick={openAddAssetModal} leftSection={<IconPlus size={18} />}>
//         Add asset
//       </Button>
//     </CanAccess>
//   );
// };

// export default AddAssetModalButton;
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import AddAssetModal from "./AddAssetModal";

const AddAssetModalButton = () => {
  const [addAssetModalOpened, { open: openAddAssetModal, close: closeAddAssetModal }] = useDisclosure(false);

  return (
    <>
      <AddAssetModal isOpen={addAssetModalOpened} onClose={closeAddAssetModal} />

      <Button onClick={openAddAssetModal} leftSection={<IconPlus size={18} />}>
        Add asset
      </Button>
    </>
  );
};

export default AddAssetModalButton;