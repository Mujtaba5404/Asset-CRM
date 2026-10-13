import { ActionIcon, Group, Image, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconFileFilled, IconPhotoPlus, IconX } from "@tabler/icons-react";
import { truncate } from "lodash";
import formatBytes from "src/utils/formatBytes";

const AttachmentsUpload = ({ value = [], onChange }) => {
  const handleDrop = (files) => {
    const updated = [...value, ...files];
    onChange?.(updated);
  };

  const removeFile = (index) => {
    const updated = value.filter((_, i) => i !== index);
    onChange?.(updated);
  };

  return (
    <Stack>
      <Dropzone accept={IMAGE_MIME_TYPE} multiple onDrop={handleDrop} p="md" styles={{ inner: { height: "100%" } }}>
        <Stack h={"inherit"} align="center" justify="center">
          <IconPhotoPlus size={40} strokeWidth={1.25} />
          <Text size="sm" tt={"initial"}>
            Drag files here or click to upload
          </Text>
        </Stack>

        {value.length > 0 && (
          <SimpleGrid cols={{ md: 3 }} mt={"md"}>
            {value.map((file, index) => (
              <Paper key={index} component={Group} title={file.name} w={"100%"} miw={"max-content"} gap={"xs"} p={"xs"}>
                {file.type.startsWith("image/") ? <Image src={URL.createObjectURL(file)} w={28} h={28} fit="contain" radius="sm" /> : <IconFileFilled size={28} />}

                <Stack gap={2} align="start">
                  <Text size="xs" tt={"initial"}>
                    {truncate(file.name, { length: 20 })}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {formatBytes(file.size)}
                  </Text>
                </Stack>

                <ActionIcon size={"xs"} color="red" ml={"auto"} onClick={() => removeFile(index)}>
                  <IconX size={11} />
                </ActionIcon>
              </Paper>
            ))}
          </SimpleGrid>
        )}
      </Dropzone>
    </Stack>
  );
};

export default AttachmentsUpload;
