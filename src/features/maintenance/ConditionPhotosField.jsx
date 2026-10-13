import { Anchor, Badge, Group, Image, Paper, Stack, Text } from "@mantine/core";
import FormSection from "../../components/FormSection";
import toFileUrl, { toFileName } from "../../utils/toFileUrl";
import AttachmentsUpload from "../attachments/AttachmentsUpload";

/**
 * One "asset condition" photo set inside a maintenance form: the photos
 * already saved on the job, then a dropzone for new ones.
 *
 * @param {Object}   props
 * @param {string}   props.title
 * @param {string}   props.description
 * @param {React.ReactNode} props.icon
 * @param {Array}    [props.saved]  Photos already on the job: stored paths
 *   (what the API returns) or attachment objects.
 * @param {File[]}   props.value    Newly picked files.
 * @param {Function} props.onChange
 */
const ConditionPhotosField = ({ title, description, icon, saved = [], value, onChange }) => {
  const savedPhotos = (saved ?? []).filter((photo) => toFileUrl(photo));
  const count = savedPhotos.length + value.length;

  return (
    <FormSection
      title={title}
      description={description}
      icon={icon}
      action={
        <Badge variant="light" color={count ? undefined : "gray"} style={{ flexShrink: 0 }}>
          {count} {count === 1 ? "photo" : "photos"}
        </Badge>
      }
    >
      <Stack gap="sm">
        {savedPhotos.length > 0 && (
          <Stack gap={6}>
            <Text fz="xs" c="dimmed" fw={500}>
              Saved · {savedPhotos.length}
            </Text>

            <Group gap="sm">
              {savedPhotos.map((photo, index) => (
                <Paper key={photo?._id || `${photo}-${index}`} p={4} w={88} withBorder>
                  <Anchor href={toFileUrl(photo)} target="_blank" rel="noreferrer" aria-label={`Open ${toFileName(photo)}`}>
                    <Image src={toFileUrl(photo)} alt={toFileName(photo)} h={56} radius="sm" fit="cover" />
                  </Anchor>

                  <Text fz={10} mt={4} truncate>
                    {toFileName(photo)}
                  </Text>

                  <Badge size="xs" variant="light" color="teal" mt={2}>
                    Saved
                  </Badge>
                </Paper>
              ))}
            </Group>
          </Stack>
        )}

        <AttachmentsUpload value={value} onChange={onChange} />
      </Stack>
    </FormSection>
  );
};

export default ConditionPhotosField;
