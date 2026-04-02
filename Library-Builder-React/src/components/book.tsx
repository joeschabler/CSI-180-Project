import type { FC } from "react";

export interface BookProps {
  id: string; // required for dragging books
  title?: string;
  color?: string;
  height?: string;
  width?: string;
  isbn?: string;
  pageCount?: number;
  coverArt?: string;
  edition?: string;
  onClick?: () => void;
}

export const Book: FC<BookProps> = ({
  title = "Unknown",
  color = "#8b0000",
  height = "130px",
  width = "35px",
  isbn,
  pageCount,
  coverArt,
  edition,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        height: height,
        width: width,
        backgroundColor: color,
        border: "1px solid rgba(0,0,0,0.4)",
        borderRadius: "3px 2px 2px 3px",
        boxShadow:
          "inset 4px 0 6px rgba(0,0,0,0.1), 2px 2px 4px rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "0.8rem",
        fontFamily: "sans-serif",
        padding: "5px",
        boxSizing: "border-box",
        cursor: onClick ? "pointer" : "default",
        writingMode: "vertical-rl",
        textOrientation: "mixed",
      }}
    >
      {title}
    </div>
  );
};
