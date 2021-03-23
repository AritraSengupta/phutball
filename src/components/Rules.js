import React from 'react';

const Rules = (props) => {
  return (
    <React.Fragment>
      <span style={props.style} onClick={props.onClick}> Rules 
        <span style={{transform: 'rotate(90deg)', paddingLeft: '4px'}}>{'>'}</span>
      </span>
      {<div className={`rules-box ${props.showRules ? 'box-show' : 'box-hide'}`}>
        <span style={{ fontSize: '15px', fontWeight: 500 }}>Controls:</span>
        <ul>
          <li>Single click on an empty grid to create a player (1 turn)</li>
          <li>Drag the ball (yellow dot) to a free grid provided there are players to jump over</li>
          <li>In one turn multiple jumps can be performed provided they are legal. Jumps are optional and can be stopped at any time.</li>
          <li>Goal is to drag the ball to the opponents goal</li>
          <li>Before a game begins switch to auto or manual will make the game versus computer or another player. Resets after every goal</li>
        </ul>

        <span style={{ fontSize: '15px', fontWeight: 500 }}>UI:</span>
        <ul>
          <li>Ball: yellow, players: black and transparent circles to show possible ball position in the next move</li>
          <li>Drag the ball and it will show the possible positions</li>
          <li>Blue: neutral position, green: winning position, red: own goal(losing position)</li>
          <li>The game will calculate if the player has already just before the final move and need not be performed manually</li>
        </ul>
      </div>}
    </React.Fragment>
  )
}

export default Rules;