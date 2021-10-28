import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import '../styles/bracket.scss';
import { useState, useEffect } from 'react';

const starterGames = {
  west: ['Gonzaga', 'Norfolk', 'Oklahoma', 'Missouri', 'Creighton', 'UCSB', 'Virginia', 'Ohio',
      'USC', 'Drake', 'Kansas', 'Eastern Wash.', 'Oregon', 'VCU', 'Iowa', 'Grand Canyon'],
  east: ['Michigan', 'Texas Southern', 'LSU', 'St. Bonaventure', 'Colorado', 'Georgetown',
      'Florida St.', 'UNC Greenboro', 'BYU', 'UCLA', 'Texas', 'Abilene Christian', 'UConn', 'Maryland', 'Alabama', 'Iona'],
  south: ['Baylor', 'Hartford', 'North Carolina', 'Wisconsin', 'Villanova', 'Winthrop',
      'Purdue', 'North Texas', 'Texas Tech', 'Utah St', 'Arkansas', 'Colgate', 'Florida', 'Virginia Tech',
      'Ohio St', 'Oral Roberts'],
  midwest: ['Illinois', 'Drexel', 'Loyola Chicago', 'Georgia Tech', 'Tennessee', 'Oregon St',
      'Oklahoma St.', 'Liberty', 'San Diego St.', 'Syracuse', 'West Virginia', 'Morehead St.',
      'Clemson', 'Rutgers', 'Houston', 'Cleveland St']
};

function BracketItem(props) {
  const { team, classes, withSpacer, teamObj, click  } = props;
  const [ variant, setVariant ] = useState(teamObj.win ? 'contained' : 'outlined');
  console.log('variant', variant, teamObj.win);


  const buttonClick = () => {
    if (!team) return;
    console.log('before', teamObj.win);
    teamObj.toggleWin();
    console.log('after', teamObj.win);

    const newVariant = teamObj.win ? 'contained' : 'outlined';
    console.log(variant, 'vs', newVariant);

    setVariant(newVariant);

    // trigger props for rerender i think
    click();
  }

  const item = (
    <li className={classes}>
      <Button onClick={buttonClick} variant={variant}>{team ? team : 'holder'} b</Button>
    </li>
  );

  if (withSpacer) {
    return (
      <>
        <li className='spacer'>&nbsp;</li>

        {item}
      </>
    );
  } else {
    return item;
  }
  // todo:
  // 1. Style team name & icon
  // 2. incorporate click action

}

BracketItem.propTypes = {
  team: PropTypes.string,
  teamObj: PropTypes.object.isRequired,
  click: PropTypes.func.isRequired,
  classes: PropTypes.string.isRequired,
  withSpacer: PropTypes.bool,
};

class Node {
  constructor(team, round, side, parent) {
    this.team = team;
    this.round = round;
    this.side = side;
    this.parent = parent;
    this.win = false;
    this.upperChild = null;
    this.lowerChild = null;
  }

  // deal with parent factor
  toggleWin() {
    if (this.win) {
      let curr = this.parent;
      console.log(this);
      while(this.team && this.parent && curr.parent.team === this.team) {
        curr.team = null;
        curr = curr.parent;
      }
    } else {
      this.parent.lowerChild.win = false;
      this.parent.upperChild.win = false;
      this.parent.team = this.team;
      console.log('here', this);
    }

    this.win = !this.win;
    console.log('hello friend', this.win);
  }

  //
}

// let rounds = [];
function buildLeftSeed(refreshBracket) {
  // rounds = [];
  const nodeArr = [];
  const classes = `game-left game-top`;
  const round = [];

  starterGames.west.concat(starterGames.east).forEach((team, i) => {
    const node = new Node(team, 1, 'left');
    round.push(<BracketItem team={node.team} classes={classes} withSpacer={i % 2 === 0} teamObj={node} click={refreshBracket}/>);
    nodeArr.push(node);
  });

  return [nodeArr, round];
};

function buildRoundLeft(roundArr, roundNumber, refreshBracket) {
  const nodeArr = [];
  const classes = `game-left game-top`;
  const round = [];

  let currNode;
  for(let i = 0; i < roundArr.length; i++) {
    if(i % 2 === 0) {
      currNode = new Node(null, roundNumber, 'left');
      currNode.upperChild = roundArr[i];
    } else {
      let numSpacers = 1;

      if (roundNumber === 3) {
        numSpacers = 2;
      }

      currNode.lowerChild = roundArr[i];
      nodeArr.push(currNode);
      round.push(<BracketItem team={'holder'} classes={classes} withSpacer={true} teamObj={currNode} click={refreshBracket}/>);
    }

    roundArr[i].parent = currNode;
  }

  if (roundNumber > 2) {
    round.push(<li className='spacer'>&nbsp;</li>);
  }

  return [nodeArr, round];
}

function buildRight(parentArr, roundNumber, isSeed, seed, refreshBracket) {
  const nodeArr = [];
  const classes = `game-right game-top`;
  const round = [];
  let counter = 0;

  parentArr.forEach((parent) => {
    parent.upperChild = new Node(isSeed ? seed[counter++] : null, roundNumber, 'right', parent);
    parent.lowerChild = new Node(isSeed ? seed[counter++] : null, roundNumber, 'right', parent);
    round.push(<BracketItem team={parent.upperChild.team} classes={classes} withSpacer={true} teamObj={parent.upperChild} click={refreshBracket}/>);
    round.push(<BracketItem team={parent.lowerChild.team} classes={classes} withSpacer={!isSeed} teamObj={parent.lowerChild} click={refreshBracket}/>);
    nodeArr.push(parent.upperChild)
    nodeArr.push(parent.lowerChild);
  });

  // rounds.push(round);
  return [nodeArr, round];
}

export default function Bracket(props) {
  let [ rounds, setRounds ] = useState([]);

  function buildTree(refresh) {
    if (rounds.length === 12 && !refresh) return;
    console.log('rendering!')
    const tempRounds = [];

    // build left side of bracket
    let [seedLeft, round] = buildLeftSeed(refreshBracket); // 32
    tempRounds.push(round);

    let holder = seedLeft;
    for (let i = 2; i < 6; i++) {
      [holder, round] = buildRoundLeft(holder, i, refreshBracket);
      tempRounds.push(round);
    }

    let rootNode;

    [rootNode, round] = buildRoundLeft(holder, '', 7, refreshBracket); // winner
    tempRounds.push(round);

    // build right side of bracket
    holder = rootNode;
    for (let j = 6; j >= 2; j--) {
      [holder, round] = buildRight(holder, j, false, [], refreshBracket);
      tempRounds.push(round);
    }

    [holder, round] = buildRight(holder, 1, true, starterGames.south.concat(starterGames.midwest), refreshBracket);
    tempRounds.push(round);

    console.log('temp', tempRounds.length);

    setRounds(tempRounds);
  }

  buildTree(false);

  function refreshBracket() {
    // buildTree(true);
  }



  return <div className='tournament'>
    {rounds.map((round, i) => {
      const roundNum = i <= 5 ? i : Math.abs(i-12);
      const classes = `round round-${roundNum}`;
      return (
        <ul className={classes}>
        {round.map((item) => item)}
      </ul>)
    })}
  </div>


  // for rendering:
  // - find available width
  // - divide into # rounds (ie 16 --> 4 rounds, 32 --> 5 (2^5 = 32))
  // - render buttons in correct locations
  // - render lines between (maybe a png of the ]-)

}
