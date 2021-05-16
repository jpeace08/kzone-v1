import React, { useMemo } from "react";
import { Table } from "antd";
import { Main } from "./styled";

const TableWraper = (props) => {
  let className = "custom-table ";
  if (props.className) className += props.className;
  const columns = useMemo(() => {
    return (props.columns || [])
      .filter((item) => !item.hidden)
      .map((item, index) => {
        item.key = "col" + index;
        return item;
      });
  }, [props.columns]);
  const rowKey = useMemo(() => {
    let item = (props.dataSource || [])[0];
    return props.rowKey || (item?.id ? "id" : "");
  }, [props.dataSource, props.rowKey]);

  const renderColumn = (col, item, index, index2) => {
    let data = item[col.dataIndex];
    if (col.render) return col.render(data, item, index);
    return data;
  };
  return (
    <Main scroll={props.scroll}>
      {!props.children && (
        <table
          className={`table-header table m-0 ${props.className || ""}`}
          style={props.style}
        >
          {props.children ? (
            props.children
          ) : (
            <>
              <thead>
                <tr>
                  {columns.map((item, index) => {
                    return (
                      <th
                        style={{
                          width: item.width ? item.width : "auto",
                          textAlign: item.align || "center",
                        }}
                        key={index}
                      >
                        {item.title}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {(props.dataSource || []).map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      <tr>
                        {columns.map((col, index2) => {
                          return (
                            <td
                              key={index2}
                              style={{
                                width: col.width ? col.width : "auto",
                                textAlign: col.align || "center",
                              }}
                            >
                              {renderColumn(col, item, index, index2)}
                            </td>
                          );
                        })}
                        {/* return <td key={index}>Mark</td>; */}
                      </tr>
                      {props.listNestedRow.includes(item[rowKey]) && (
                        <tr>
                          <td colSpan={columns.length}>
                            {props.onShowNestedTable &&
                              props.onShowNestedTable(item, index)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </>
          )}
        </table>
      )}
    </Main>

    // <Table
    //   pagination={false}
    //   {...props}
    //   columns={columns}
    //   className={className}
    //   rowKey={rowKey}
    // />
    // </Main>
  );
};
TableWraper.defaultProps = {
  listNestedRow: [],
};
export default TableWraper;
