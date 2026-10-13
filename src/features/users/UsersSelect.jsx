import { Loader } from "@mantine/core";
import { useGetAllUsersQuery } from "../../api/user";
import Select from "../../components/Select";

const UsersSelect = ({ selectProps = {}, queryObject = {} }) => {
  const users = useGetAllUsersQuery({ query: queryObject });

  return (
    <Select
      data={Array.isArray(users.data) ? users.data : undefined}
      selectLabel="name"
      selectValue="_id"
      searchable
      clearable
      rightSection={users.isLoading && <Loader size={18} />}
      {...selectProps}
      {...(users.isError && { disabled: true, placeholder: "Error loading userssss" })}
    />
  );
};

export default UsersSelect;
