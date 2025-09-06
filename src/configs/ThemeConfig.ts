import type { ThemeConfig } from 'antd';

const defaultColor = '#000000e0'

const theme: ThemeConfig = {
  token: {
    fontSize: 16,
    colorPrimary: '#52c41a',
    // colorLink: '#52c41a',
    // colorTextBase: '#eee'
    // borderRadius: 20
  },
  components: {
    Button: {
      colorLink: 'defaultColor'
    }
  }
};

export default theme;