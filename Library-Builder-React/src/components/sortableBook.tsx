import type { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Book, type BookProps } from "./book";

interface SortableBookProps extends BookProps {
  disabled?: boolean;
}

export const SortableBook: FC<SortableBookProps> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id, disabled: props.disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: props.disabled ? "pointer" : "grab", // changes to grab mouse cursor when hovering over book if in edit mode
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Book {...props} />
    </div>
  );
};
