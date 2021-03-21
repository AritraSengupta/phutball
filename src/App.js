import PhutBall from './components/PhutBall';

const styles = {
  wrapper: {
    width: '40px',
    height: '40px',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  itemWrapper: {
  }
}

function App() {
  return (
    <div className="App">
      <PhutBall />
    </div>
  );
}

export default App;
