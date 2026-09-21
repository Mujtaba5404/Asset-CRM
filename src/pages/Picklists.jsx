import { Paper, ScrollArea, Tabs } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const tabList = [
  { label: upperFirst("asset status"), value: "asset-status", index: true },
  { label: upperFirst("asset categories"), value: "asset-categories" },
  { label: upperFirst("asset sub categories"), value: "asset-sub-categories" },
  { label: upperFirst("asset locations"), value: "asset-locations" },
  { label: upperFirst("asset conditions"), value: "asset-conditions" },
  { label: upperFirst("warranty providers"), value: "warranty-providers" },
  { label: upperFirst("disposal reasons"), value: "disposal-reasons" },
];

const Picklists = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const indexTab = tabList.find((tab) => tab.index);

  const pathParts = pathname.split("/");
  const lastSegment = pathParts[pathParts.length - 1];

  const activeTab = tabList.find((tab) => tab.value === lastSegment)?.value || indexTab.value;

  return (
    <>
      <Tabs variant="pills" mb="lg" value={activeTab} onChange={(value) => navigate(`/admin-settings/picklists/${value}`)}>
        <Paper p={4}>
          <ScrollArea w="100%" scrollbars="x" scrollbarSize={10}>
            <Tabs.List style={{ flexWrap: "nowrap" }}>
              {tabList.map((tab, i) => (
                <Tabs.Tab key={i} value={tab.value}>
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </ScrollArea>
        </Paper>
      </Tabs>

      <Outlet />
    </>
  );
};

export default Picklists;
