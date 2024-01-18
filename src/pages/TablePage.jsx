import { Card, Table } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllApplications,
  getAllApplicationsDb,
  storeSelectedApplications,
} from "../store/slices/application";

const columns = [
  {
    title: "Name",
    dataIndex: "title",
  },
  {
    title: "Nr",
    dataIndex: "id",
  },
  {
    title: "Typ",
    dataIndex: ["vzk_type", "name"],
  },
  {
    title: "Status",
    dataIndex: ["vzk_status", "name"],
  },
];

const TablePage = () => {
  const dispatch = useDispatch();
  const allApplications = useSelector(getAllApplications);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      dispatch(storeSelectedApplications(selectedRows));
    },
  };

  useEffect(() => {
    dispatch(getAllApplicationsDb());
  }, []);

  return (
    <div className="h-full max-h-[calc(100vh-73px)] w-full bg-zinc-200 p-2 flex flex-col items-center gap-2">
      <Card className="h-full w-full overflow-clip" title="Anträge">
        <Table
          columns={columns}
          dataSource={allApplications}
          rowSelection={rowSelection}
          rowKey={(record) => record.id}
          pagination={false}
          className="w-full"
        />
      </Card>
    </div>
  );
};

export default TablePage;
