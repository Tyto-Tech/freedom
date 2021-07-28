import { Component } from 'react';
import { Layout } from 'components';
import dynamic from 'next/dynamic';

const Button = dynamic(() => import('elementz/lib/Components/Button'), {
  ssr: false
});

export default class MainPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: '',
      users: ''
    };
  }
  componentDidMount() {
    socket.on('message', (msgs) =>
      msgs.map((msg) =>
        this.setState({
          messages: (
            <>
              {this.state.messages}
              <span>
                <br />
                {msg.author}: {msg.content}
              </span>
            </>
          )
        })
      )
    );
    socket.on('online', (users) =>
      users.map(
        (user) =>
          !user ||
          this.setState({
            users: (
              <>
                {this.state.users}
                <span id={user.id} className='onlineUser'>
                  <br />
                  {user.username}
                </span>
              </>
            )
          })
      )
    );
    socket.on('offline', (user) => document.getElementById(user?.id)?.remove());
  }

  onClick() {
    socket.send(
      {
        message: this.state.message ?? '',
        id
      },
      (err) => {
        this.setState({
          messages: (
            <>
              {err}
              <br />
              {this.state.messages}
            </>
          )
        });
      }
    );
  }

  render() {
    return (
      <Layout>
        <style>{`
                    input {
                        margin-bottom: 10px;
                    }


                    #output span * {
                        display: inline-block;
                    }
                    
                    #online {
                      margin: 100px;
                    }
                `}</style>
        <input
          placeholder='Send A Message!'
          onChange={(e) => this.setState({ message: e.target.value })}></input>
        <br />
        <Button className='test' onClick={() => this.onClick()}>
          Send Message
        </Button>
        <div id='output'>{this.state.messages}</div>
        <div id='online'>
          <h2>Online Users</h2>
          <hr />
          <div>{this.state.users}</div>
        </div>
      </Layout>
    );
  }
}