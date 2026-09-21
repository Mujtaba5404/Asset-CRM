import Picklists from "../../../features/picklists/Picklists";

const DisposalReasons = () => {
  return (
    <Picklists featureName="disposal reason" resource="Asset" field="lifecycle.disposalReason">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default DisposalReasons;