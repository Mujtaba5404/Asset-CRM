import { Button, Drawer, Fieldset, Grid, NumberInput, ScrollArea, Stack, Switch, TextInput, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useUpdateAssetMutation } from "../../api/asset";
import PicklistsSelect from "../picklists/components/PicklistsSelect";

const HALF = { base: 12, sm: 6 };
const THIRD = { base: 12, sm: 4 };
const FULL = 12;

const toDate = (value) => (value ? new Date(value) : null);
const toId = (value) => value?._id ?? value ?? null;


const toFormValues = (asset = {}) => ({
  location: toId(asset.location),
  category: toId(asset.category),
  subCategory: toId(asset.subCategory),
  status: toId(asset.status),
  condition: toId(asset.condition),
  serialNumber: asset.serialNumber || "",
  description: asset.description || "",
  purchaseAmount: asset.purchaseAmount ?? "",
  purchaseDate: toDate(asset.purchaseDate),
  hasExpiry: !!asset.hasExpiry,
  expiryDate: toDate(asset.expiryDate),
  warranty: {
    isWarrantied: !!asset.warranty?.isWarrantied,
    startDate: toDate(asset.warranty?.startDate),
    endDate: toDate(asset.warranty?.endDate),
    provider: toId(asset.warranty?.provider),
  },
  lifecycle: {
    acquiredAt: toDate(asset.lifecycle?.acquiredAt),
    activatedAt: toDate(asset.lifecycle?.activatedAt),
    retiredAt: toDate(asset.lifecycle?.retiredAt),
    disposedAt: toDate(asset.lifecycle?.disposedAt),
    disposalReason: toId(asset.lifecycle?.disposalReason),
  },
});

const EditAssetModal = ({ asset, isOpen = false, onClose = () => {} }) => {
  const updateAssetMutation = useUpdateAssetMutation();

  const form = useForm({ initialValues: toFormValues(asset) });

  useEffect(() => {
    if (isOpen && asset) form.setValues(toFormValues(asset));
  }, [isOpen, asset?._id, asset?.updatedAt]);

  form.watch("category", ({ value, previousValue }) => {
    if (previousValue && value !== previousValue) form.setFieldValue("subCategory", null);
  });

  const { category, hasExpiry, warranty } = form.values;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    updateAssetMutation.mutate(
      { assetId: asset._id, payload: values },
      {
        onSuccess: () => onClose(),
      }
    );
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
    <Drawer size="lg" position="right" offset={8} radius="md" title={"Update asset"} opened={isOpen} onClose={handleClose}>
      <Stack component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <ScrollArea.Autosize mah="calc(100vh - 180px)" scrollbars="y" offsetScrollbars>
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
        </ScrollArea.Autosize>

        <Button type="submit" loading={updateAssetMutation.isPending}>
          Update asset
        </Button>
      </Stack>
    </Drawer>
  );
};

export default EditAssetModal;