import { useEffect, useState} from "react";
import { Table, Form, Upload, Modal } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

function bytesToSize(bytes: any) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  var i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
  return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
}

const fetchData = async () => {
  const result = await axios.get("http://localhost:5000/api/getFiles");
  return await result.data.data;
};

function App() {
  const [Data, setData] = useState([]);

  const Delete = async (record: any) => {
    console.log(record);
    await axios.delete(`http://localhost:5000/api/deleteFile/${record.id}`);
    const result = await fetchData();
    setData(result);
  };

  const columns = [
    {
      key: "id",
      title: "Name",
      render: (record: any) => {
        return (
          <>
            <p style={{ marginLeft: "50px" }}>{record.name}</p>
          </>
        );
      },
    },
    {
      key: "id",
      title: "Path",
      render: (record: any) => {
        return (
          <>
            <p style={{ margin: "auto 20px" }}>{record.path}</p>
          </>
        );
      },
    },
    {
      key: "id",
      title: "Size",
      render: (record: any) => {
        return (
          <>
            <p style={{ margin: "auto 20px" }}>
              {record.size ? bytesToSize(record.size) : "0 Byte"}
            </p>
          </>
        );
      },
    },
    {
      key: "id",
      title: "Date",
      render: (record: any) => {
        return (
          <>
            <p style={{ margin: "auto 20px" }}>{record.date}</p>
          </>
        );
      },
    },
    {
      key: "action",
      title: "Actions",
      render: (record: any) => {
        return (
          <>
            <DeleteOutlined
              style={{ color: "red" }}
              onClick={() => Delete(record)}
            />
          </>
        );
      },
    },
  ];

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    const formData = new FormData();

    formData.append("file", values.file);
    try {
      await axios.post("http://localhost:5000/api/uploadFile", formData);
      const result = await fetchData();
      setData(result);
    } catch (error) {
      Modal.info({
        title: "Error",
        content: "File Too large",
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    const getData = async () => {
      const newdata = await fetchData();
      setData(newdata);
    };
    getData();
    return () => {};
  }, []);

  return (

    <div className="App">
      <h2>File Uploader</h2>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ margin: "50px 10rem" }}
      >
        <Form.Item
          label="Upload"
          valuePropName="fileList"
          style={{
            width: "20%",
            padding: "5px 15px",
            border: "1px solid #1F8130",
            cursor: "pointer",
          }}
        >
          <Upload customRequest={onFinish} listType="picture">
            <div>
              <PlusOutlined style={{ marginTop: "20px" }} />
              <div style={{ marginTop: 3 }}></div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
      <div className="table" style={{ margin: "100px 200px" }}>
        <Table dataSource={Data} columns={columns} pagination={false} rowKey="id" />
      </div>
    </div>

  );
}

export default App;
