import { Autocomplete, Box, Group, Radio, SimpleGrid, Stack, Text, TextInput } from "@mantine/core";
import { IconId, IconRoute, IconShieldLock, IconWorld } from "@tabler/icons-react";
import FormSection, { FormColumn, FormColumns } from "../../components/FormSection";
import PermissionsEditor from "./PermissionsEditor";
import classes from "./RoleForm.module.css";
import { LANDING_PAGE_OPTIONS, SCOPE_OPTIONS } from "./rolePermissions";

const RoleForm = ({ form, catalog }) => (
  <Stack gap="md">
    <FormColumns>
      <FormColumn>
        <FormSection icon={<IconId size={20} />} title="Role details" description="What the role is called and where its users land after signing in.">
          <Stack gap="md">
            <TextInput required label="Title" placeholder="e.g. Store manager" data-autofocus {...form.getInputProps("title")} />

            <Autocomplete
              required
              label="Landing page"
              description="Opened right after sign-in"
              placeholder="/"
              data={LANDING_PAGE_OPTIONS}
              leftSection={<IconRoute size={16} />}
              {...form.getInputProps("indexPath")}
            />
          </Stack>
        </FormSection>
      </FormColumn>

      <FormColumn>
        <FormSection icon={<IconWorld size={20} />} title="Data scope" description="Which records this role's permissions reach.">
          <Radio.Group {...form.getInputProps("scope")}>
            <SimpleGrid cols={2} spacing="xs">
              {SCOPE_OPTIONS.map((option) => (
                <Radio.Card key={option.value} value={option.value} className={classes.scopeCard} p="sm" radius="md">
                  <Group wrap="nowrap" align="flex-start" gap="sm">
                    <Radio.Indicator size="sm" mt={2} />

                    <Box miw={0}>
                      <Group gap={6} wrap="nowrap">
                        <Text fz="sm" fw={600}>
                          {option.label}
                        </Text>

                        <Box w={7} h={7} style={{ borderRadius: 999, background: `var(--mantine-color-${option.color}-filled)`, flexShrink: 0 }} />
                      </Group>

                      <Text fz="xs" c="dimmed" lh={1.35}>
                        {option.description}
                      </Text>
                    </Box>
                  </Group>
                </Radio.Card>
              ))}
            </SimpleGrid>
          </Radio.Group>
        </FormSection>
      </FormColumn>
    </FormColumns>

    <FormSection
      icon={<IconShieldLock size={20} />}
      title="Permissions"
      description="Tick what this role can do on each resource. Granting update lets you narrow which fields it may change."
    >
      <PermissionsEditor
        catalog={catalog}
        value={form.getValues().permissions}
        onChange={(permissions) => form.setFieldValue("permissions", permissions)}
        error={form.errors.permissions}
      />
    </FormSection>
  </Stack>
);

export default RoleForm;
