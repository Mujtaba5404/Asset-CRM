import { useLocalStorage } from "@mantine/hooks";
import Select from "../../components/Select";

/** The signed-in user's companies, as returned by the login response. */
const CompaniesSelect = ({ selectProps = {} }) => {
  const [auth] = useLocalStorage({ key: "auth", getInitialValueInEffect: false });

  const companies = (Array.isArray(auth?.companies) ? auth.companies : [])
    .filter((company) => company?._id)
    .map((company) => ({ _id: company._id, title: company.title ?? company.name ?? company._id }));

  return (
    <Select
      data={companies}
      tt="capitalize"
      selectLabel="title"
      selectValue="_id"
      searchable
      nothingFoundMessage="No companies on your account"
      {...selectProps}
    />
  );
};

export default CompaniesSelect;
