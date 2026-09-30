import { Badge, Collapse, Menu, Tooltip } from "@mantine/core";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import classes from "./Appsidebar.module.css";

const isMatch = (path, pathname) => !!matchPath({ path, end: false }, pathname);

/**
 * One sidebar entry.
 *
 * State lives on the icon tile — outlined when idle, brand-gradient when active —
 * so the current page reads at a glance even in the collapsed icon rail, where
 * labels are hidden.
 */
const AppSidebarLink = ({ link: { title, path, icon: Icon, count = 0, children }, collapsed }) => {
  const { pathname } = useLocation();

  const active = children ? children.some((child) => isMatch(child.path, pathname)) : isMatch(path, pathname);

  const [opened, setOpened] = useState(active);

  const icon = (
    <span className={classes.linkIcon}>
      <Icon size={19} stroke={1.7} />
    </span>
  );

  const badge =
    count > 0 ? (
      <Badge className={classes.linkBadge} size="sm" circle variant={active ? "filled" : "light"}>
        {count > 9 ? "9+" : count}
      </Badge>
    ) : null;

  /* ---------------------------------------------------- collapsed icon rail */
  if (collapsed) {
    const railLink = (
      <Link to={children ? (children[0]?.path ?? path) : path} className={classes.link} data-active={active || undefined} aria-label={title}>
        {icon}
      </Link>
    );

    if (!children) {
      return (
        <Tooltip label={title} position="right" withArrow offset={14}>
          {railLink}
        </Tooltip>
      );
    }

    return (
      <Menu trigger="hover" position="right-start" offset={14} withArrow>
        <Menu.Target>{railLink}</Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>{title}</Menu.Label>

          {children.map((child) => (
            <Menu.Item key={child.path} component={Link} to={child.path} c={isMatch(child.path, pathname) ? "var(--mantine-primary-color-filled)" : undefined}>
              {child.title}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    );
  }

  /* ------------------------------------------------------- expanded, nested */
  if (children) {
    return (
      <>
        <button type="button" className={classes.link} data-active={active || undefined} aria-expanded={opened} onClick={() => setOpened((value) => !value)}>
          {icon}
          <span className={classes.linkLabel}>{title}</span>
          {opened ? <IconChevronDown size={15} /> : <IconChevronRight size={15} />}
        </button>

        <Collapse in={opened}>
          <div className={classes.sublist}>
            {children.map((child) => (
              <Link key={child.path} to={child.path} className={classes.sublink} data-active={isMatch(child.path, pathname) || undefined}>
                <span className={classes.subdot} />
                {child.title}
              </Link>
            ))}
          </div>
        </Collapse>
      </>
    );
  }

  /* ---------------------------------------------------------- expanded, flat */
  return (
    <Link to={path} className={classes.link} data-active={active || undefined}>
      {icon}

      <span className={classes.linkLabel}>{title}</span>

      {badge}

      <span className={classes.linkArrow} aria-hidden="true">
        <IconChevronRight size={15} />
      </span>
    </Link>
  );
};

export default AppSidebarLink;
