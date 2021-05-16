import React, { useMemo, useState, useEffect, useRef } from "react";
import { Table } from "antd";
import "./style.scss";
import { Resizable } from "react-resizable";
const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};
const TableWraper = (props) => {
  const dataWidth = useRef({});
  const [state, _setState] = useState({
    columns: [],
  });

  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };

  let className = "custom-table ";
  if (props.className) className += props.className;
  const handleResize = (index) => (e, { size }) => {
    const nextColumns = [...(state.columns || [])];
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width,
    };
    dataWidth.current["col" + index] = size.width;
    setState({
      columns: nextColumns,
    });
  };
  // const dragProps = {
  //   onDragEnd(fromIndex, toIndex) {
  //     let columns = [...state.columns];
  //     const item = columns.splice(fromIndex, 1)[0];
  //     columns.splice(toIndex, 0, item);
  //     columns = columns.map((item, index) => {
  //       item.key = "col" + index;
  //       return item;
  //     });
  //     setState({
  //       columns: [...state.columns],
  //     });
  //   },
  //   nodeSelector: "th",
  //   handleSelector: ".dragHandler",
  //   ignoreSelector: "react-resizable-handle",
  // };

  useEffect(() => {
    const columns = (props.columns || []).filter((item) => !item.hidden);
    setState({
      columns,
    });
  }, [props.columns]);

  const columns = useMemo(() => {
    const columns = (state.columns || []).map((col, index) => ({
      ...col,
      key: "col" + index,
      width: dataWidth.current["col" + index] || col.width,
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: handleResize(index),
      }),
    }));

    return columns;
  }, [state.columns]);

  const rowKey = useMemo(() => {
    let item = (props.dataSource || [])[0];
    return props.rowKey || (item?.id ? "id" : "");
  }, [props.dataSource, props.rowKey]);

  return (
    // <ReactDragListView.DragColumn {...dragProps}>
    <Table
      components={{
        header: {
          cell: ResizableTitle,
        },
      }}
      // bordered
      pagination={false}
      {...props}
      id="components-table-demo-resizable-column"
      columns={columns}
      className={className}
      rowKey={rowKey}
    />
    // </ReactDragListView.DragColumn>
  );
};
export default TableWraper;
