import { Grid, NumberInput, Switch, Textarea, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCash, IconHourglass, IconPackage, IconShieldCheck } from "@tabler/icons-react";
import FormSection, {
  FormColumn,
  FormColumns,
} from "../../components/FormSection";
import PicklistsSelect from "../picklists/components/PicklistsSelect";

const HALF = { base: 12, sm: 6 };
const FULL = 12;

/**
 * The asset field set, shared by the create and edit drawers so the two screens
 * can never drift apart.
 */
const AssetForm = ({ form }) => {
  const { category, hasExpiry, warranty } = form.values;

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

            {picklist("status", "Status", { required: true })}
            {picklist("condition", "Condition", { required: true })}
            {picklist("location", "Location", { required: true, span: FULL })}

            <Grid.Col span={FULL}>
              <Textarea
                label="Description"
                placeholder="Apple laptop assigned to the design team"
                {...form.getInputProps("description")}
              />
            </Grid.Col>
          </Grid>
        </FormSection>
      </FormColumn>

      <FormColumn>
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
