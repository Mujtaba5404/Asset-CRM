import { IconListSearch } from "@tabler/icons-react";
import { Navigate, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { DEFAULT_PICKLIST_SLUG, findPicklistItem } from "../features/picklists/picklistRegistry";

/**
 * Resolves `/settings/picklists/:slug` to the screen registered for that slug.
 *
 * One route instead of ~50 hand-written ones — adding a picklist means adding a
 * row to the registry.
 */
const Picklists = () => {
  const { slug } = useParams();

  if (!slug) return <Navigate to={DEFAULT_PICKLIST_SLUG} replace />;

  const item = findPicklistItem(slug);

  if (!item) {
    return (
      <EmptyState
        title="Unknown list"
        description={`“${slug}” is not a configurable list. Pick one from the list on the left.`}
        icon={<IconListSearch size={26} />}
      />
    );
  }

  const Screen = item.element;

  // Keyed so switching lists resets the create/edit form state.
  return <Screen key={slug} />;
};

export default Picklists;
