import { useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'antd';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = (values: { name: string }) => {
    if (localStorage.getItem('members')) {
      const historyMembers = JSON.parse(localStorage.getItem('members'));
      const find = historyMembers.find((f: string) => f === values.name);

      if (!find) {
        historyMembers.push(values.name);
        localStorage.setItem('members', JSON.stringify(historyMembers));
      }
    } else {
      const newMembers = [];
      newMembers.push(values.name);
      localStorage.setItem('members', JSON.stringify(newMembers));
    }

    navigate(`/chat?user=${values.name}`, { replace: true });
  };

  return (
    <div className="w-full h-[100vh] flex items-center justify-center">
      <div className="w-[500px] h-[500px] p-8 bg-[#2d343e] flex justify-center flex-col rounded-[5px] items-center">
        <h1 className="text-white text-3xl mb-16">Welcome to ChatApp</h1>
        <Form form={form} layout="vertical" className="w-full" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            rules={[{ message: 'user name is required', type: 'string', required: true }]}
            label={
              <>
                <span className="text-white">User name</span>
              </>
            }
          >
            <Input placeholder="Input your user name" className="w-full h-10 bg-[#404450] border-none hover:outline-none text-white" />
          </Form.Item>
          <div className="text-center">
            <Button type="default" htmlType="submit" className="bg-blue-500 text-white border-none focus:border-none outline-none">
              Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
