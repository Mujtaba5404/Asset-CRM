import { ActionIcon, Badge, Button, Grid, Group, NumberInput, Paper, Select, Stack, Text, Textarea, Tooltip } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCalendarEvent, IconCamera, IconCash, IconChecklist, IconClipboardText, IconNote, IconPhotoCheck, IconPlus, IconTrash } from "@tabler/icons-react";
import FormSection, { FormColumn, FormColumns } from "../../components/FormSection";
import { toDateValue } from "../../utils/dateValue";
import AssetSelect from "../assets/AssetSelect";
import PicklistsSelect from "../picklists/components/PicklistsSelect";
import ConditionPhotosField from "./ConditionPhotosField";
import { EMPTY_CHECKLIST_ITEM, getMaintenanceStatusOption, isCompleted, MAINTENANCE_STATUS_OPTIONS } from "./maintenanceForm";

const HALF = { base: 12, sm: 6 };
const FULL = 12;

const StatusIcon = ({ status }) => {
  const option = getMaintenanceStatusOption(status);
  if (!option) return null;

  const Icon = option.icon;

  return <Icon size={16} color={`var(--mantine-color-${option.color}-filled)`} />;
};

/**
 * Asset condition photos, driven by status: Initiated shows the "before" set,
 * Completed swaps it for the "after" set.
 */
const MaintenancePhotoFields = ({ form, photos, onPhotosChange, job }) =>
  isCompleted(form.values.status) ? (
    <ConditionPhotosField
      title="Condition after service"
      description="How the asset looked when the work was done"
      icon={<IconPhotoCheck size={20} />}
      saved={job?.conditionAfter}
      value={photos.conditionAfter}
      onChange={(files) => onPhotosChange("conditionAfter", files)}
    />
  ) : (
    <ConditionPhotosField
      title="Condition before service"
      description="How the asset looked when it came in"
      icon={<IconCamera size={20} />}
      saved={job?.conditionBefore}
      value={photos.conditionBefore}
      onChange={(files) => onPhotosChange("conditionBefore", files)}
    />
  );

/**
 * The maintenance field set, shared by the add, edit and "mark completed"
 * drawers so they can never drift apart.
 *
 * @param {Object}   props
 * @param {Object}   props.form
 * @param {{conditionBefore: File[], conditionAfter: File[]}} props.photos  Newly picked files.
 * @param {Function} props.onPhotosChange (field, files) => void
 * @param {Object}   [props.job] Saved job, for its existing photos.
 */
const MaintenanceFormFields = ({ form, photos, onPhotosChange, job }) => {
  const { checklist, status } = form.values;
  const statusInput = form.getInputProps("status");

  // Completing a job almost always means "today", so fill it in.
  const handleStatusChange = (value) => {
    statusInput.onChange(value);
    if (isCompleted(value) && !form.values.endDate) form.setFieldValue("endDate", toDateValue(new Date()));
  };

  const picklist = (path, label, { span = HALF, ...props } = {}) => (
    <Grid.Col span={span}>
      <PicklistsSelect
        queryObject={{ resource: "Maintenance", field: path }}
        selectProps={{ label, placeholder: `Select ${label.toLowerCase()}`, ...props, ...form.getInputProps(path) }}
      />
    </Grid.Col>
  );

  return (
    <FormColumns>
      <FormColumn>
        <FormSection icon={<IconClipboardText size={20} />} title="Job" description="What is being serviced and how urgent it is">
          <Grid align="flex-start">
            <Grid.Col span={FULL}>
              <AssetSelect selectProps={{ required: true, searchable: true, nothingFoundMessage: "No assets found", ...form.getInputProps("asset") }} />
            </Grid.Col>

            <Grid.Col span={FULL}>
              <Select
                required
                label="Status"
                placeholder="Select status"
                allowDeselect={false}
                description={isCompleted(status) ? "Add photos of the asset after service." : "Add photos of the asset before service."}
                data={MAINTENANCE_STATUS_OPTIONS.map(({ value, label }) => ({ value, label }))}
                leftSection={<StatusIcon status={status} />}
                renderOption={({ option }) => (
                  <Group gap="xs" wrap="nowrap">
                    <StatusIcon status={option.value} />
                    <Text fz="sm">{option.label}</Text>
                  </Group>
                )}
                {...statusInput}
                onChange={handleStatusChange}
              />
            </Grid.Col>

            {picklist("type", "Type", { required: true })}
            {picklist("priority", "Priority", { required: true })}
            {picklist("vendor", "Vendor", { span: FULL })}
          </Grid>
        </FormSection>

        <FormSection icon={<IconCalendarEvent size={20} />} title="Schedule" description="When the asset went in and came back">
          <Grid align="flex-start">
            <Grid.Col span={HALF}>
              <DateInput required clearable label="Start date" placeholder="Pick start date" {...form.getInputProps("startDate")} />
            </Grid.Col>

            <Grid.Col span={HALF}>
              <DateInput
                required={isCompleted(status)}
                clearable
                label="End date"
                placeholder="Pick end date"
                minDate={form.values.startDate || undefined}
                {...form.getInputProps("endDate")}
              />
            </Grid.Col>
          </Grid>
        </FormSection>

        <FormSection icon={<IconNote size={20} />} title="Notes" description="Anything the technician or next inspector should know">
          <Textarea placeholder="This is test maintenance" autosize minRows={3} maxRows={8} {...form.getInputProps("notes")} />
        </FormSection>
      </FormColumn>

      <FormColumn>
        <MaintenancePhotoFields form={form} photos={photos} onPhotosChange={onPhotosChange} job={job} />

        <FormSection
          icon={<IconChecklist size={20} />}
          title="Inspection checklist"
          description="What was checked and how it looked"
          action={
            <Badge variant="light" color="gray" style={{ flexShrink: 0 }}>
              {checklist.length} {checklist.length === 1 ? "check" : "checks"}
            </Badge>
          }
        >
          <Stack gap="sm">
            {checklist.map((_, index) => (
              <Paper key={index} p="xs" withBorder>
                <Group gap="xs" wrap="nowrap" align="flex-start">
                  <Grid align="flex-start" gutter="xs" flex={1}>
                    {["item", "condition"].map((field) => (
                      <Grid.Col key={field} span={HALF}>
                        <PicklistsSelect
                          queryObject={{ resource: "Maintenance", field: `checklist.${field}` }}
                          selectProps={{
                            label: field[0].toUpperCase() + field.slice(1),
                            placeholder: `Select ${field}`,
                            ...form.getInputProps(`checklist.${index}.${field}`),
                          }}
                        />
                      </Grid.Col>
                    ))}
                  </Grid>

                  <Tooltip label="Remove check" withArrow>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      mt={26}
                      disabled={checklist.length === 1}
                      onClick={() => form.removeListItem("checklist", index)}
                      aria-label="Remove check"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Paper>
            ))}

            <Button variant="light" size="xs" leftSection={<IconPlus size={16} />} onClick={() => form.insertListItem("checklist", { ...EMPTY_CHECKLIST_ITEM })}>
              Add check
            </Button>
          </Stack>
        </FormSection>

        <FormSection icon={<IconCash size={20} />} title="Cost" description="Everything the job cost">
          <NumberInput label="Total cost" placeholder="150,500" min={0} prefix="Rs " thousandSeparator="," hideControls {...form.getInputProps("cost")} />
        </FormSection>
      </FormColumn>
    </FormColumns>
  );
};

export default MaintenanceFormFields;
