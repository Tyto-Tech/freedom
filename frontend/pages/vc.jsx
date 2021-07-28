import { Layout } from 'components';
import dynamic from 'next/dynamic';
import { Component } from 'react';

const Button = dynamic(() => import('elementz/lib/Components/Button'), {
  ssr: false
});

const Input = dynamic(() => import('elementz/lib/Components/Input'), {
  ssr: false
});

export default class Vc extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: ''
    };
  }
  componentDidMount() {}

  async onClick() {
    console.log(this.state.username);
  }

  render() {
    return (
      <Layout>
        <Input
          onChange={(e) => this.setState({ username: e.target.value })}></Input>
        <Button onClick={() => this.onClick()}>Click Me To Start VC</Button>
      </Layout>
    );
  }
}