import React from "react";
import ContentLoader from "react-content-loader";

interface PropTypes {
  columnWidth: Array<string | number>;
  rowCounts?: number;
  rowHeight?: number;
  className?: string;
  radius?: number;
  verticalGap?: number
}

export function TableContentLoaderWithProps ({
    columnWidth, rowCounts=5, rowHeight, className, radius=15, verticalGap
  }: PropTypes, props: React.PropsWithChildren) {
    const rows = rowCounts || 5;
    const height = rowHeight || 50;
    let spaceValue = 0;
  
    /* it will store an array with the sum of the columnWidth array elements one by one like
    const arr = [1, 2, 3, 6];
    then the array will be [0, 3, 6, 12]
    */
    const spaceArray = columnWidth.map((item) => {
      spaceValue += Number(item) + 0.1;
      return spaceValue - Number(item);
    });
  
    return (
      <div className={className || "mb-2"} {...props}>
        {Array.from(Array(rows).keys()).map((row, i) => (
          <ContentLoader
            viewBox={`0 0 1500 ${height}`}
            key={i}
            backgroundColor={"#E1E1E1"}
          >
            {columnWidth?.map((column, index) => (
              <React.Fragment key={index}>
                <rect
                  x={
                    typeof column === "string"
                      ? `${Number(column)}%`
                      : `${spaceArray[index]}%`
                  }
                  y={height > 80 ? verticalGap || 30 : verticalGap || 20}
                  rx={radius}
                  ry={radius}
                  width={typeof column === "string" ? `0%` : `${column}%`}
                  height={height - (verticalGap ?? 30)}
                />
              </React.Fragment>
            ))}
          </ContentLoader>
        ))}
      </div>
    );
  }