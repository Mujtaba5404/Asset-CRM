import PageHeader from "../components/PageHeader";
import AddDepreciationButton from "../features/depreciations/AddDepreciationButton";
import DepreciationTable from "../features/depreciations/DepreciationTable";

const DepreciationsPage = () => (
  <>
    <PageHeader title="Depreciations" description="How each asset loses value over its useful life." actions={<AddDepreciationButton />} />

    <DepreciationTable emptyAction={<AddDepreciationButton label="Create the first depreciation" />} />
  </>
);

export default DepreciationsPage;
