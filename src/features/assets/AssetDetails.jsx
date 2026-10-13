import {
  Avatar,
  Box,
  CopyButton,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCalendarX,
  IconCash,
  IconCategory,
  IconCheck,
  IconClockHour4,
  IconCopy,
  IconMapPin,
  IconNote,
  IconProgressCheck,
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { useGetAssetByIdQuery } from "../../api/asset";
import DataField from "../../components/DataField";
import EmptyState from "../../components/EmptyState";
import InfoList from "../../components/InfoList";
import PageHeader from "../../components/PageHeader";
import PicklistBadge from "../../components/PicklistBadge";
import SectionCard from "../../components/SectionCard";
import StatCard from "../../components/StatCard";
import capitalizeLetters from "../../utils/capitalizeLetters";
import { daysUntil, describeDueDate, formatDayCount } from "../../utils/dateValue";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import getAbbreviation from "../../utils/getAbbreviation";
import { toStatusItem } from "./assetStatus";
import AssetWarrantyBadge, {
  WARRANTY_EXPIRY_WINDOW_DAYS,
} from "./AssetWarrantyBadge";
import DeleteAssetButton from "./DeleteAssetButton";
import EditAssetModalButton from "./EditAssetModalButton";

const AssetDetailsSkeleton = () => (
  <Stack gap="md">
    <Skeleton height={34} width={260} radius="sm" />
    <Skeleton height={104} radius="md" />
    <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} height={116} radius="md" />
      ))}
    </SimpleGrid>
    <Grid>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Skeleton height={280} radius="md" />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Skeleton height={280} radius="md" />
      </Grid.Col>
    </Grid>
  </Stack>
);

const AssetDetails = () => {
  const { id } = useParams();

  const { data: asset, isLoading, isError, error } = useGetAssetByIdQuery(id);

  if (isLoading) return <AssetDetailsSkeleton />;

  if (isError || !asset) {
    return (
      <>
        <PageHeader
          title="Asset"
          backTo="/assets"
          breadcrumbs={[
            { label: "Assets", to: "/assets" },
            { label: "Not found" },
          ]}
        />

        <EmptyState
          variant="error"
          title="This asset could not be loaded"
          description={
            error?.response?.data?.message ||
            error?.message ||
            "It may have been deleted, or you may not have access to it."
          }
          icon={<IconAlertTriangle size={26} />}
        />
      </>
    );
  }

  const warrantyDaysLeft = asset.warranty?.hasWarranty
    ? daysUntil(asset.warranty.endDate)
    : null;
  const expiryDaysLeft = asset.hasExpiry ? daysUntil(asset.expiryDate) : null;
  const ageInDays = asset.purchaseDate
    ? -1 * (daysUntil(asset.purchaseDate) ?? 0)
    : null;

  const classification = [
    {
      icon: <IconMapPin size={18} />,
      label: "location",
      children: <PicklistBadge item={asset.location} />,
    },
    {
      icon: <IconProgressCheck size={18} />,
      label: "status",
      children: <PicklistBadge item={toStatusItem(asset.status)} />,
    },
    {
      icon: <IconSparkles size={18} />,
      label: "condition",
      children: <PicklistBadge item={asset.condition} />,
    },
  ];

  return (
    <Stack gap="md">
      <PageHeader
        backTo="/assets"
        breadcrumbs={[
          { label: "Assets", to: "/assets" },
          { label: asset.tag || asset.serialNumber || "Asset" },
        ]}
        title={asset.tag || asset.serialNumber || "Untitled asset"}
        meta={
          <Group gap="xs">
            {asset.tag && (
              <CopyButton value={asset.tag} timeout={1600}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? "Copied" : "Copy tag"} withArrow>
                    <Box
                      component="button"
                      type="button"
                      onClick={copy}
                      aria-label="Copy asset tag"
                      c={copied ? "teal" : "dimmed"}
                      style={{
                        display: "flex",
                        background: "none",
                        border: 0,
                        cursor: "pointer",
                        padding: 2,
                      }}
                    >
                      {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    </Box>
                  </Tooltip>
                )}
              </CopyButton>
            )}

            <PicklistBadge item={toStatusItem(asset.status)} />
            <AssetWarrantyBadge warranty={asset.warranty} />
          </Group>
        }
        actions={
          <>
            <EditAssetModalButton asset={asset} />
            <DeleteAssetButton
              assetId={asset._id}
              redirect
              variant="button"
              buttonText="Delete"
            />
          </>
        }
      />

      {/* Identity strip — who this record is, at a glance. */}
      <Paper p="md">
        <Group gap="md" wrap="wrap" align="center">
          <Avatar size={56} radius="md" color={asset.category?.color || "gray"}>
            {getAbbreviation(asset.subCategory?.title || asset.serialNumber)}
          </Avatar>

          <Group gap="xl" wrap="wrap" flex={1} miw={0}>
            <DataField label="Serial number">{asset.serialNumber}</DataField>

            <DataField label="Category">
              <PicklistBadge item={asset.category} />
            </DataField>

            <DataField label="Sub category">
              <PicklistBadge item={asset.subCategory} />
            </DataField>
          </Group>
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
        <StatCard
          label="Purchase value"
          value={formatAmount(asset.purchaseAmount || 0)}
          hint={formatDate(asset.purchaseDate)}
          icon={<IconCash size={18} />}
          tone="orange"
        />

        <StatCard
          label="Warranty"
          value={
            !asset.warranty?.hasWarranty
              ? "None"
              : warrantyDaysLeft === null
                ? "Covered"
                : warrantyDaysLeft < 0
                  ? "Expired"
                  : formatDayCount(warrantyDaysLeft)
          }
          hint={
            asset.warranty?.hasWarranty
              ? (describeDueDate(asset.warranty.endDate) ?? "No end date")
              : "Not covered"
          }
          icon={<IconShieldCheck size={18} />}
          tone={
            !asset.warranty?.hasWarranty
              ? "gray"
              : warrantyDaysLeft !== null && warrantyDaysLeft < 0
                ? "red"
                : warrantyDaysLeft !== null &&
                    warrantyDaysLeft <= WARRANTY_EXPIRY_WINDOW_DAYS
                  ? "orange"
                  : "teal"
          }
        />

        <StatCard
          label="Expires"
          value={
            !asset.hasExpiry
              ? "Never"
              : expiryDaysLeft !== null && expiryDaysLeft < 0
                ? "Expired"
                : formatDate(asset.expiryDate)
          }
          hint={
            asset.hasExpiry
              ? (describeDueDate(asset.expiryDate) ?? undefined)
              : "No expiry set"
          }
          icon={<IconCalendarX size={18} />}
          tone={
            !asset.hasExpiry
              ? "gray"
              : expiryDaysLeft !== null && expiryDaysLeft < 0
                ? "red"
                : expiryDaysLeft !== null && expiryDaysLeft <= 30
                  ? "orange"
                  : "teal"
          }
        />

        <StatCard
          label="Age in service"
          value={
            ageInDays === null ? "—" : formatDayCount(ageInDays)
          }
          hint={
            asset.purchaseDate
              ? `Since ${formatDate(asset.purchaseDate)}`
              : "No purchase date"
          }
          icon={<IconClockHour4 size={18} />}
          tone="gray"
        />
      </SimpleGrid>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <SectionCard
            icon={<IconCategory size={16} />}
            title="Classification"
            padding="xs"
          >
            <InfoList p="xs" withBorder={false}>
              {classification.map((item) => (
                <InfoList.Item
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                >
                  {item.children}
                </InfoList.Item>
              ))}
            </InfoList>
          </SectionCard>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            <SectionCard icon={<IconShieldCheck size={16} />} title="Warranty">
              {asset.warranty?.hasWarranty ? (
                <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
                  <DataField label="Provider">
                    <PicklistBadge item={asset.warranty.provider} />
                  </DataField>
                  <DataField label="Start date">
                    {formatDate(asset.warranty.startDate)}
                  </DataField>
                  <DataField label="End date">
                    {formatDate(asset.warranty.endDate)}
                  </DataField>
                  <DataField label="Coverage">
                    <AssetWarrantyBadge warranty={asset.warranty} />
                  </DataField>
                </SimpleGrid>
              ) : (
                <Text fz="sm" c="dimmed">
                  This asset is not under warranty.
                </Text>
              )}
            </SectionCard>

            <SectionCard icon={<IconNote size={16} />} title="Notes">
              <Text
                fz="sm"
                style={{ whiteSpace: "pre-wrap" }}
                c={asset.notes ? undefined : "dimmed"}
              >
                {asset.notes
                  ? capitalizeLetters(asset.notes)
                  : "No notes"}
              </Text>
            </SectionCard>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default AssetDetails;
