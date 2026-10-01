import PageHeader from "../components/PageHeader";
import AssetSummary from "../features/assets/AssetSummary";

const AssetSummaryPage = () => (
  <>
    <PageHeader title="Summary" description="The register cross-tabulated — pick any two groupings to see where assets and value sit." />

    <AssetSummary />
  </>
);

export default AssetSummaryPage;
