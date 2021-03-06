// Provider Pattern

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Switch from '../switch'
import renderApp from '../render-app'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
  static defaultProps = {
    defaultOn: false,
    onToggle: () => {},
    onReset: () => {},
  }
  initialState = {on: this.props.defaultOn}
  state = this.initialState
  reset = () => {
    if (this.isOnControlled()) {
      this.props.onReset(!this.props.on)
    } else {
      this.setState(this.initialState, () => this.props.onReset(this.state.on))
    }
  }
  toggle = () => {
    if (this.isOnControlled()) {
      this.props.onToggle(!this.props.on)
    } else {
      this.setState(
        ({on}) => ({on: !on}),
        () => this.props.onToggle(this.state.on),
      )
    }
  }
  getTogglerProps = ({onClick, ...props} = {}) => ({
    onClick: callAll(onClick, this.toggle),
    'aria-expanded': this.state.on,
    ...props,
  })
  isOnControlled() {
    return this.props.on !== undefined
  }
  render() {
    return this.props.render({
      on: this.isOnControlled() ? this.props.on : this.state.on,
      toggle: this.toggle,
      reset: this.reset,
      getTogglerProps: this.getTogglerProps,
    })
  }
}

const ToggleContext = React.createContext({on: false, toggle: () => {}})

class ToggleProvider extends React.Component {
  render() {
    const {children, ...remainingProps} = this.props
    return (
      <Toggle
        {...remainingProps}
        render={toggle => (
          <ToggleContext.Provider value={toggle} children={children} />
        )}
      />
    )
  }
}

function Nav() {
  return (
    <ToggleContext.Consumer>
      {toggle => (
        <nav style={{flex: 1}}>
          <ul
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              listStyle: 'none',
              paddingLeft: '0',
            }}
          >
            <li>
              <a href="index.html">{toggle.on ? '🏡' : 'Home'}</a>
            </li>
            <li>
              <a href="/about/">{toggle.on ? '❓' : 'About'}</a>
            </li>
            <li>
              <a href="/blog/">{toggle.on ? '📖' : 'Blog'}</a>
            </li>
          </ul>
        </nav>
      )}
    </ToggleContext.Consumer>
  )
}
function NavSwitch() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <div>
        <ToggleContext.Consumer>
          {toggle => (toggle.on ? '🦄' : 'Enable Emoji')}
        </ToggleContext.Consumer>
      </div>
      <ToggleContext.Consumer>
        {toggle => (
          <Switch
            {...toggle.getTogglerProps({
              on: toggle.on,
            })}
          />
        )}
      </ToggleContext.Consumer>
    </div>
  )
}
function Header() {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <Nav />
        <NavSwitch />
      </div>
    </div>
  )
}
function Subtitle() {
  return (
    <ToggleContext.Consumer>
      {toggle => (toggle.on ? '👩‍🏫 👉 🕶' : 'Teachers are awesome')}
    </ToggleContext.Consumer>
  )
}
function Title() {
  return (
    <div>
      <h1>
        <ToggleContext.Consumer>
          {toggle => `Who is ${toggle.on ? '🕶❓' : 'awesome?'}`}
        </ToggleContext.Consumer>
      </h1>
      <Subtitle />
    </div>
  )
}
function Article() {
  return (
    <div>
      <ToggleContext.Consumer>
        {toggle =>
          [
            'Once, I was in',
            toggle.on ? '🏫‍' : 'school',
            'when I',
            toggle.on ? '🤔' : 'realized',
            'something...',
          ].join(' ')
        }
      </ToggleContext.Consumer>
      <hr />
      <ToggleContext.Consumer>
        {toggle =>
          [
            'Without',
            toggle.on ? '👩‍🏫' : 'teachers',
            `I wouldn't know anything so`,
            toggle.on ? '🙏' : 'thanks',
            toggle.on ? '👩‍🏫❗️' : 'teachers!',
          ].join(' ')
        }
      </ToggleContext.Consumer>
    </div>
  )
}
function Post() {
  return (
    <div>
      <Title />
      <Article />
    </div>
  )
}
function App() {
  return (
    <ToggleProvider>
      <div>
        <Header />
        <Post />
      </div>
    </ToggleProvider>
  )
}

renderApp(<App />)
