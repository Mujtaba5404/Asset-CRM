import EmptyState from "./EmptyState";

/**
 * Back-compat wrapper around <EmptyState />, kept so existing call sites
 * (`<Placeholder title=... icon=... />`) keep working unchanged.
 */
const Placeholder = ({ title = "", icon, ...props }) => <EmptyState title={title} icon={icon} {...props} />;

export default Placeholder;
