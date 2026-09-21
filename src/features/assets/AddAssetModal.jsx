import { Button, Drawer, Fieldset, Grid, NumberInput, ScrollArea, Stack, Switch, TextInput, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useCreateAssetMutation } from "../../api/asset";
import PicklistsSelect from "../picklists/components/PicklistsSelect";

const HALF = { base: 12, sm: 6 };
const THIRD = { base: 12, sm: 4 };
const FULL = 12;

const INITIAL_VALUES = {
  location: null,
  category: null,
  subCategory: null,
  status: null,
  condition: null,
  serialNumber: "",
  description: "",
  purchaseAmount: "",
  purchaseDate: null,
  hasExpiry: false,
  expiryDate: null,
  warranty: { isWarrantied: false, startDate: null, endDate: null, provider: null },
  lifecycle: { acquiredAt: null, activatedAt: null, retiredAt: null, disposedAt: null, disposalReason: null },
};

const DRAWER_STYLES = {
  content: { display: "flex", flexDirection: "column" },
  body: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 },
};

const AddAssetModal = ({ isOpen = false, onClose = () => {} }) => {
  const createAssetMutation = useCreateAssetMutation();
  const navigate = useNavigate();

  const form = useForm({ initialValues: INITIAL_VALUES });

  form.watch("category", ({ value, previousValue }) => {
    if (value !== previousValue) form.setFieldValue("subCategory", null);
  });

  const { category, hasExpiry, warranty } = form.values;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    createAssetMutation.mutate(values, {
      onSuccess: ({ data }) => {
        form.reset();
        onClose();
        navigate(`/assets/${data._id}`);
      },
    });
  };

  const picklist = (path, label, { span = HALF, query, ...props } = {}) => (
    <Grid.Col span={span}>
      <PicklistsSelect
        queryObject={{ resource: "Asset", field: path, ...query }}
        selectProps={{ label, placeholder: `Select ${label.toLowerCase()}`, ...props, ...form.getInputProps(path) }}
      />
    </Grid.Col>
  );

  const date = (path, label, { span = HALF, ...props } = {}) => (
    <Grid.Col span={span}>
      <DateInput clearable valueFormat="DD MMM YYYY" label={label} placeholder={`Pick ${label.toLowerCase()}`} {...props} {...form.getInputProps(path)} />
    </Grid.Col>
  );

  return (
    <Drawer size="lg" position="right" offset={8} radius="md" title="Add asset" opened={isOpen} onClose={handleClose} styles={DRAWER_STYLES}>
      <Stack component="form" onSubmit={form.onSubmit(handleSubmit)} style={{ flex: 1, minHeight: 0 }}>
        <ScrollArea scrollbars="y" offsetScrollbars style={{ flex: 1, minHeight: 0 }}>
          <Stack>
            <Fieldset legend="Asset details" variant="filled" radius="md">
              <Grid align="flex-start">
                <Grid.Col span={HALF}>
                  <TextInput required label="Serial number" placeholder="MAC-BOOK-PRO" {...form.getInputProps("serialNumber")} />
                </Grid.Col>

                {picklist("location", "Location", { required: true })}
                {picklist("category", "Category", { required: true })}
                {picklist("subCategory", "Sub category", {
                  required: true,
                  disabled: !category,
                  query: { parentPicklist: category },
                  placeholder: category ? "Select sub category" : "Select a category first",
                })}
                {picklist("status", "Status", { required: true })}
                {picklist("condition", "Condition", { required: true })}

                <Grid.Col span={FULL}>
                  <Textarea label="Description" placeholder="Apple laptop assigned to employee" autosize minRows={3} maxRows={4} {...form.getInputProps("description")} />
                </Grid.Col>
              </Grid>
            </Fieldset>

            <Fieldset legend="Purchase" variant="filled" radius="md">
              <Grid align="flex-start">
                <Grid.Col span={HALF}>
                  <NumberInput required label="Purchase amount" placeholder="150,000" min={0} thousandSeparator="," hideControls {...form.getInputProps("purchaseAmount")} />
                </Grid.Col>

                {date("purchaseDate", "Purchase date", { required: true })}

                <Grid.Col span={FULL}>
                  <Switch label="This asset has an expiry date" {...form.getInputProps("hasExpiry", { type: "checkbox" })} />
                </Grid.Col>

                {hasExpiry && date("expiryDate", "Expiry date", { required: true, span: FULL })}
              </Grid>
            </Fieldset>

            <Fieldset legend="Warranty" variant="filled" radius="md">
              <Grid align="flex-start">
                <Grid.Col span={FULL}>
                  <Switch label="This asset is under warranty" {...form.getInputProps("warranty.isWarrantied", { type: "checkbox" })} />
                </Grid.Col>

                {warranty.isWarrantied && (
                  <>
                    {picklist("warranty.provider", "Provider", { span: THIRD })}
                    {date("warranty.startDate", "Start date", { span: THIRD, required: true })}
                    {date("warranty.endDate", "End date", { span: THIRD, required: true, minDate: warranty.startDate || undefined })}
                  </>
                )}
              </Grid>
            </Fieldset>

            
          </Stack>
        </ScrollArea>

        <Button type="submit" loading={createAssetMutation.isPending}>
          Add asset
        </Button>
      </Stack>
    </Drawer>
  );
};

export default AddAssetModal;