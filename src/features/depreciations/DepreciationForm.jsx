import { Grid, NumberInput, Select, Stack } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCash, IconTrendingDown } from "@tabler/icons-react";
import FormSection from "../../components/FormSection";
import AssetSelect from "../assets/AssetSelect";
import { DEPRECIATION_METHOD_OPTIONS, DEPRECIATION_METHODS } from "./depreciationFormValues";

const HALF = { base: 12, sm: 6 };
const FULL = 12;

const AMOUNT_PROPS = { min: 0, prefix: "Rs ", thousandSeparator: ",", hideControls: true };

/**
 * The depreciation field set, shared by the create and edit drawers. The asset
 * options come from the "Get all assets" endpoint via <AssetSelect />.
 */
const DepreciationForm = ({ form }) => {
  const { method } = form.values;

  return (
    <Stack gap="md">
      <FormSection icon={<IconTrendingDown size={20} />} title="Schedule" description="Which asset is depreciated, how, and from when">
        <Grid align="flex-start">
          <Grid.Col span={FULL}>
            <AssetSelect
              selectProps={{
                required: true,
                searchable: true,
                nothingFoundMessage: "No assets found",
                "data-autofocus": true,
                ...form.getInputProps("asset"),
              }}
            />
          </Grid.Col>

          <Grid.Col span={HALF}>
            <Select required label="Method" placeholder="Select method" allowDeselect={false} data={DEPRECIATION_METHOD_OPTIONS} {...form.getInputProps("method")} />
          </Grid.Col>

          <Grid.Col span={HALF}>
            <DateInput required label="Start date" placeholder="Pick start date" {...form.getInputProps("startDate")} />
          </Grid.Col>

          <Grid.Col span={HALF}>
            <NumberInput required label="Useful life" placeholder="24" min={1} allowDecimal={false} suffix=" months" hideControls {...form.getInputProps("usefulLifeMonths")} />
          </Grid.Col>

          <Grid.Col span={HALF}>
            <NumberInput
              required={method === DEPRECIATION_METHODS.DECLINING_BALANCE}
              label="Depreciation rate"
              placeholder="20"
              min={0}
              max={100}
              suffix=" %"
              hideControls
              {...form.getInputProps("depreciationRate")}
            />
          </Grid.Col>
        </Grid>
      </FormSection>

      <FormSection icon={<IconCash size={20} />} title="Values" description="What the asset cost and what it is worth at the end of its life">
        <Grid align="flex-start">
          <Grid.Col span={HALF}>
            <NumberInput required label="Acquisition cost" placeholder="150,000" {...AMOUNT_PROPS} {...form.getInputProps("acquisitionCost")} />
          </Grid.Col>

          <Grid.Col span={HALF}>
            <NumberInput required label="Salvage value" placeholder="20,000" {...AMOUNT_PROPS} {...form.getInputProps("salvageValue")} />
          </Grid.Col>
        </Grid>
      </FormSection>
    </Stack>
  );
};

export default DepreciationForm;
