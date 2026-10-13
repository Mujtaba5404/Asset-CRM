import { Grid, NumberInput, Select, Switch, Textarea, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCash, IconHourglass, IconPackage, IconShieldCheck, IconUserPin } from "@tabler/icons-react";
import { useEffect } from "react";
import { useGetAllPicklistsQuery } from "../../api/picklist";
import FormSection, {
  FormColumn,
  FormColumns,
} from "../../components/FormSection";
import CompaniesSelect from "../companies/CompaniesSelect";
import PicklistsSelect from "../picklists/components/PicklistsSelect";
import UsersSelect from "../users/UsersSelect";
import { ASSET_STATUS_OPTIONS } from "./assetStatus";

const HALF = { base: 12, sm: 6 };
const FULL = 12;

/**
 * The asset field set, shared by the create and edit drawers so the two screens
 * can never drift apart.
 */
const AssetForm = ({ form }) => {
  const { category, subCategory, hasExpiry, requiresEmployee, warranty } = form.values;

  // Same query as the sub category select below, so this reads from its cache.
  const subCategories = useGetAllPicklistsQuery({
    query: { resource: "Asset", field: "subCategory", parentPicklist: category },
  });
  const pickedSubCategory = Array.isArray(subCategories.data)
    ? subCategories.data.find((item) => item._id === subCategory)
    : undefined;

  // Kept on the form so validation can see it; stripped from the payload.
  useEffect(() => {
    if (subCategories.isLoading) return;

    const next = !!pickedSubCategory?.meta?.requiresEmployee;
    if (next !== requiresEmployee) form.setFieldValue("requiresEmployee", next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedSubCategory, subCategories.isLoading, requiresEmployee]);

  const picklist = (path, label, { span = HALF, query, ...props } = {}) => (
    <Grid.Col span={span}>
      <PicklistsSelect
        queryObject={{ resource: "Asset", field: path, ...query }}
        selectProps={{
          label,
          placeholder: `Select ${label.toLowerCase()}`,
          ...props,
          ...form.getInputProps(path),
        }}
      />
    </Grid.Col>
  );

  const date = (path, label, { span = HALF, ...props } = {}) => (
    <Grid.Col span={span}>
      <DateInput
        label={label}
        placeholder={`Pick ${label.toLowerCase()}`}
        {...props}
        {...form.getInputProps(path)}
      />
    </Grid.Col>
  );

  return (
    <FormColumns>
      <FormColumn>
        <FormSection
          icon={<IconPackage size={20} />}
          title="Asset"
          description="What this asset is and how it is identified"
        >
          <Grid align="flex-start">
            <Grid.Col span={FULL}>
              <TextInput
                required
                label="Serial number"
                placeholder="MAC-BOOK-PRO-0142"
                {...form.getInputProps("serialNumber")}
              />
            </Grid.Col>

            {picklist("category", "Category", { required: true, span: FULL })}
            {picklist("subCategory", "Sub category", {
              required: true,
              span: FULL,
              disabled: !category,
              query: { parentPicklist: category },
              placeholder: category
                ? "Select sub category"
                : "Select a category first",
            })}

            <Grid.Col span={HALF}>
              <Select
                required
                label="Status"
                placeholder="Select status"
                data={ASSET_STATUS_OPTIONS}
                {...form.getInputProps("status")}
              />
            </Grid.Col>
            {picklist("condition", "Condition", { required: true })}

            <Grid.Col span={FULL}>
              <Textarea
                label="Notes"
                placeholder="Apple laptop assigned to employee"
                {...form.getInputProps("notes")}
              />
            </Grid.Col>
          </Grid>
        </FormSection>
      </FormColumn>

      <FormColumn>
        <FormSection
          icon={<IconUserPin size={20} />}
          title="Assignment"
          description="Which company owns it, where it is and who has it"
        >
          <Grid align="flex-start">
            <Grid.Col span={FULL}>
              <CompaniesSelect
                selectProps={{
                  required: true,
                  label: "Company",
                  placeholder: "Select company",
                  ...form.getInputProps("company"),
                }}
              />
            </Grid.Col>

            {picklist("location", "Location", { required: true })}

            <Grid.Col span={HALF}>
              <UsersSelect
                selectProps={{
                  required: requiresEmployee,
                  label: "Employee",
                  placeholder: "Select employee",
                  ...form.getInputProps("employee"),
                }}
              />
            </Grid.Col>
          </Grid>
        </FormSection>

        <FormSection
          icon={<IconCash size={20} />}
          title="Purchase"
          description="What it cost and when it was bought"
        >
          <Grid align="flex-start">
            <Grid.Col span={HALF}>
              <NumberInput
                required
                label="Purchase amount"
                placeholder="150,000"
                min={0}
                prefix="Rs "
                thousandSeparator=","
                hideControls
                {...form.getInputProps("purchaseAmount")}
              />
            </Grid.Col>

            {date("purchaseDate", "Purchase date", {
              required: true,
              maxDate: new Date(),
            })}
          </Grid>
        </FormSection>

        <FormSection
          icon={<IconHourglass size={20} />}
          title="Expiry"
          description="Licences, subscriptions and consumables"
        >
          <Grid align="flex-start">
            <Grid.Col span={FULL}>
              <Switch
                label="This asset has an expiry date"
                {...form.getInputProps("hasExpiry", { type: "checkbox" })}
              />
            </Grid.Col>

            {hasExpiry &&
              date("expiryDate", "Expiry date", {
                required: true,
                span: FULL,
                minDate: form.values.purchaseDate || undefined,
              })}
          </Grid>
        </FormSection>

        <FormSection
          icon={<IconShieldCheck size={20} />}
          title="Warranty"
          description="Coverage and who provides it"
        >
          <Grid align="flex-start">
            <Grid.Col span={FULL}>
              <Switch
                label="This asset is under warranty"
                {...form.getInputProps("warranty.hasWarranty", {
                  type: "checkbox",
                })}
              />
            </Grid.Col>

            {warranty.hasWarranty && (
              <>
                {picklist("warranty.provider", "Provider", { span: FULL })}
                {date("warranty.startDate", "Start date", { required: true })}
                {date("warranty.endDate", "End date", {
                  required: true,
                  minDate: warranty.startDate || undefined,
                })}
              </>
            )}
          </Grid>
        </FormSection>
      </FormColumn>
    </FormColumns>
  );
};

export default AssetForm;
