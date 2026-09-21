import { Avatar, Badge, Grid, Group, Loader, Paper, SimpleGrid, Stack, Text, Timeline, Tooltip } from "@mantine/core";
import {
    IconBox,
    IconCalendarEvent,
    IconCalendarX,
    IconCash,
    IconCategory,
    IconHash,
    IconMapPin,
    IconNote,
    IconProgressCheck,
    IconShieldCheck,
    IconSparkles,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import { truncate } from "lodash";
import { useParams } from "react-router-dom";
import { useGetAssetByIdQuery } from "../../api/asset";
import InfoList from "../../components/InfoList";
import Placeholder from "../../components/Placeholder";
import classes from "../../index.module.css";
import capitalizeLetters from "../../utils/capitalizeLetters";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import getAbbreviation from "../../utils/getAbbreviation";
import EditAssetModalButton from "./EditAssetModalButton";
import DeleteAssetButton from "./DeleteAssetButton";


const PicklistBadge = ({ item }) => {
  if (!item?.title)
    return (
      <Text size="sm" c={"dimmed"}>
        —
      </Text>
    );

  return (
    <Badge variant="light" size="sm" color={item.color || "gray"} tt={"capitalize"}>
      {item.title}
    </Badge>
  );
};

const Field = ({ label, children }) => (
  <Stack gap={2}>
    <Text size="xs" c={"dimmed"} fw={500}>
      {label}
    </Text>

    {typeof children === "string" || typeof children === "number" ? (
      <Text size="sm" fw={500}>
        {children}
      </Text>
    ) : (
      children
    )}
  </Stack>
);

const Section = ({ icon, title, children }) => (
  <Paper p={"md"}>
    <Group gap={8} align="flex-end" mb={"md"}>
      {icon}

      <Text size="xs" c={"dimmed"} fw={500}>
        {title}
      </Text>
    </Group>

    {children}
  </Paper>
);

const createInfoListItems = (asset) => [
    { icon: <IconCategory />, label: "category", children: <PicklistBadge item={asset.category} /> },
    { icon: <IconBox />, label: "subCategory", children: <PicklistBadge item={asset.subCategory} /> },
  { icon: <IconMapPin />, label: "location", children: <PicklistBadge item={asset.location} /> },
  { icon: <IconProgressCheck />, label: "status", children: <PicklistBadge item={asset.status} /> },
  { icon: <IconSparkles />, label: "condition", children: <PicklistBadge item={asset.condition} /> },
];

const createLifecycleItems = (lifecycle = {}) =>
  [
    { key: "acquiredAt", label: "Acquired", icon: <IconBox size={12} /> },
    { key: "activatedAt", label: "Activated", icon: <IconProgressCheck size={12} /> },
    { key: "retiredAt", label: "Retired", icon: <IconCalendarX size={12} /> },
    { key: "disposedAt", label: "Disposed", icon: <IconTrash size={12} /> },
  ].filter((item) => lifecycle[item.key]);

const AssetDetails = () => {
  const { id } = useParams();

  const asset = useGetAssetByIdQuery(id);

  if (asset.isLoading) return <Loader />;

  if (asset.isError) return <Placeholder title={asset.error?.response?.data.message || "Error"} icon={<IconX size={50} />} />;

  const data = asset.data;

  const infoList = createInfoListItems(data);
  const lifecycleItems = createLifecycleItems(data.lifecycle);

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 4, xl: 3 }}>
        <Stack>
          <Group>
            <Avatar alt={data.tag} size={"xl"} color={data.category?.color || "gray"}>
              {getAbbreviation(data.subCategory?.title || data.tag)}
            </Avatar>

            <Stack gap={4}>
              <Group gap={"xs"}>
                <Tooltip label={data.tag}>
                  <Text size="lg" fw={700} tt={"uppercase"}>
                    {truncate(data.tag, { length: 15 })}
                  </Text>
                </Tooltip>

                <EditAssetModalButton asset={data} />

                <DeleteAssetButton assetId={data._id} redirect />
              </Group>

              <Text size="xs" fw={500} mt={6}>
                <Text component="span" c={"dimmed"}>
                  Serial No:
                </Text>
                {` ${data.serialNumber || "—"}`}
              </Text>

              <Text size="xs" fw={500}>
                <Text component="span" c={"dimmed"}>
                  Created on:
                </Text>
                {` ${formatDate(data.createdAt)}`}
              </Text>
            </Stack>
          </Group>

          <InfoList>
            {infoList.map((item, index) => (
              <InfoList.Item key={index} icon={item.icon} label={item.label}>
                {item.children}
              </InfoList.Item>
            ))}
          </InfoList>
        </Stack>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 8, xl: 9 }}>
        <Stack>
          <Paper p={"md"}>
            <Group gap={8} align="flex-end" mb={"xs"}>
              <IconNote className={classes.icon} />

              <Text size="xs" c={"dimmed"} fw={500}>
                Description
              </Text>
            </Group>

            <Text size="sm" fw={500}>
              {capitalizeLetters(data.description || "No additional description")}
            </Text>
          </Paper>

          <Section icon={<IconCash className={classes.icon} />} title="Purchase">
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing={"md"}>
              <Field label="Amount">{formatAmount(data.purchaseAmount || 0)}</Field>

              <Field label="PurchaseDate">{formatDate(data.purchaseDate)}</Field>

              <Field label="HasExpiry">
                <Badge variant="light" size="sm" color={data.hasExpiry ? "orange" : "gray"}>
                  {data.hasExpiry ? "Yes" : "No"}
                </Badge>
              </Field>

              <Field label="ExpiryDate">{data.hasExpiry ? formatDate(data.expiryDate) : "—"}</Field>
            </SimpleGrid>
          </Section>

          <Section icon={<IconShieldCheck className={classes.icon} />} title="Warranty">
            {data.warranty?.isWarrantied ? (
              <SimpleGrid cols={{ base: 2, sm: 4 }} spacing={"md"}>
                <Field label="Provider">
                  <PicklistBadge item={data.warranty.provider} />
                </Field>

                <Field label="StartDate">{formatDate(data.warranty.startDate)}</Field>

                <Field label="EndDate">{formatDate(data.warranty.endDate)}</Field>

                <Field label="Coverage">
                  <Badge variant="light" size="sm" color="green">
                    Covered
                  </Badge>
                </Field>
              </SimpleGrid>
            ) : (
              <Text size="sm" fw={500} c={"dimmed"}>
                No warranty on this asset
              </Text>
            )}
          </Section>

        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default AssetDetails;