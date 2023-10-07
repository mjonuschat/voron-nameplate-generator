
import { Button, Col, Form, InputNumber, Row, Select, Switch, Typography } from 'antd';
import { saveAs } from 'file-saver';
import { parse } from '@tinyhttp/content-disposition'
const { Paragraph } = Typography;

type FieldType = {
  model?: string;
  serial?: number;
  logo?: boolean;
  thickness?: number;
};

const onFinish = async (values: any) => {
  const formData = new FormData();
  for (const name in values) {
    formData.append(name, values[name]);
  }
  const result = await fetch('/nameplate/create', {
    method: 'POST',
    body: formData,
  }).then(async res => {
    let filename = "nameplate.stl";
    let header: string | null;

    if(header = res.headers.get("content-disposition")) {
      let content = parse(header)
      if (content.type === "attachment") {
        filename = (content.parameters.filename ?? filename) as string;
      }
    }

    return {
      filename: filename,
      blob: await res.blob()
    }
  }).then(res => {
    console.log(res.blob, res.filename);
    saveAs(res.blob, res.filename)
  }).catch((error)=> {
    console.log('Error:', error)
  })
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

export const NamePlateShow: React.FC = () => {
  return <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
    <Col className="gutter-row" span={16} offset={4}>
      <Typography>
        <Paragraph>
          Generate a Nameplate STL to show off your official Voron serial number.
        </Paragraph>
      </Typography>

      <Form
        name="nameplate"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ thickness: 4.0, logo: false }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Printer Model"
          name="model"
          rules={[{ required: true, message: 'Please select your printer model!' }]}

        >
          <Select
            placeholder="Printer Model"
            listHeight={300}
            options={[
              { label: 'V2', value: 'VORON_TWO' },
              {
                label: 'V1 / Trident', options: [
                  { label: 'V1', value: 'VORON_ONE' },
                  { label: 'Trident', value: 'VORON_TRIDENT' }
                ]
              },
              {
                label: 'V0',
                options: [
                  { label: 'V0.0 / V0.1', value: 'VORON_ZERO' },
                  { label: 'V0.2', value: 'VORON_ZERO_R2' }
                ],
              },
              { label: 'Legacy', value: 'VORON_LEGACY' },
              { label: 'Switchwire', value: 'VORON_SWITCHWIRE' },
            ]}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Serial Number"
          name="serial"
          rules={[{ required: true, message: 'Please input your serial number!' }]}
        >
          <InputNumber
            placeholder="888"
            min={0}
            max={9999}
            step={1}
            formatter={(value) => value ? Number(value).toFixed(0) : value}
            parser={(value) => Math.round(Number(value!)).toFixed(0)}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Panel Thickness"
          name="thickness"
          rules={[{ required: false, message: 'Please input your panel thickness' }]}
        >
          <InputNumber
            min={2.5}
            max={10.0}
            step={0.5}
            addonAfter="mm"
            formatter={(value) => Number(value!).toFixed(1)}
            parser={(value) => (Math.round(Number(value!) * 2.0) / 2.0).toFixed(1)}
          />
        </Form.Item>

        <Form.Item<FieldType>
          name="logo"
          label="Voron Logo"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Generate!
          </Button>
        </Form.Item>
      </Form>
    </Col>
  </Row>
};
