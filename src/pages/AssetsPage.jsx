import PageHeader from "../components/PageHeader";
import AssetsList from "../features/assets/AssetsList";

const AssetsPage = () => (
  <>
    <PageHeader title="Assets" description="Every asset in the register, with its status, warranty and purchase history." />

    <AssetsList />
  </>
);

export default AssetsPage;
