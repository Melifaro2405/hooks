import React, {Component, useCallback, useEffect, useMemo, useState} from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const [value, setValue] = useState(1);
  const [visible, setVisible] = useState(true);

  if (visible) {
    return (
      <div>
        <button
        onClick={() => setValue((v) => v + 1)}>+</button>
        <button
        onClick={() => setVisible(false)}>hide</button>
        {/*<ClassCounter value={value}/>*/}
        {/*<HookCounter value={value} />*/}
        {/*<Notification />*/}
        <PlanetInfo id={value} />
      </div>
    );
  } else {
    return <button onClick={() => setVisible(true)}>show</button>
  }
};

const getPlanet = (id) => {
  return fetch(`https://swapi.dev/api/planets/${id}`)
    .then(res => res.json())
    .then(data => data);
};

const useRequest = (request) => {
  const initialState = useMemo(() => ({
    data: null,
    loading: true,
    error: null
  }), []);

  const [dataState, setDataState] = useState(initialState);

  useEffect(() => {
    setDataState(initialState);

    let canceled = false;

    request()
      .then(data => !canceled && setDataState({
        data,
        loading: false,
        error: null
      }))
      .catch(error => !canceled && setDataState({
        data: null,
        loading: false,
        error
      }))
    return () => canceled = true;
  }, [request]);

  return dataState;
}

const usePlanetInfo = (id) => {
  const request = useCallback(() => getPlanet(id), [id]);
  return useRequest(request)
};

const PlanetInfo = ({id}) => {
  const {data, loading, error} = usePlanetInfo(id);

  if (error) {
    return <div>Something is wrong</div>
  }

  if (loading) {
    return <div>loading...</div>
  }
  return <div>{id} - {data.name}</div>
};

const Notification = () => {

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(
      () => setVisible(false), 2500);
    return () => clearTimeout(timeout);
  }, [])

  return (
    <div>
      {visible && <p>Hello</p>}
    </div>
  )
};

const HookCounter = ({value}) => {

  useEffect(() => {
    console.log('useEffect()');
    return () => console.log('clear');
  }, [value]);

  return <p>{value}</p>
};

class ClassCounter extends Component {

  componentDidMount() {
    console.log('class: mount')
  }

  componentDidUpdate() {
    console.log('class: update')
  }

  componentWillUnmount() {
    console.log('class: unmount')
  }

  render() {
    return <p>{this.props.value}</p>
  }
};

ReactDOM.render(<App />, document.getElementById('root'));