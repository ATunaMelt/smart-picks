import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import '../styles/bracket.scss';
import { useState, useEffect } from 'react';

const starterGames = {
  west: [
    'Gonzaga',
    'Norfolk',
    'Oklahoma',
    'Missouri',
    'Creighton',
    'UCSB',
    'Virginia',
    'Ohio',
    'USC',
    'Drake',
    'Kansas',
    'East. Wash.',
    'Oregon',
    'VCU',
    'Iowa',
    'G. Canyon'
  ],
  east: [
    'Michigan',
    'Texas South.',
    'LSU',
    'Bonaventure',
    'Colorado',
    'Georgetown',
    'Florida St.',
    'UNC',
    'BYU',
    'UCLA',
    'Texas',
    'Abilene',
    'UConn',
    'Maryland',
    'Alabama',
    'Iona'
  ],
  south: [
    'Baylor',
    'Hartford',
    'N. Carolina',
    'Wisconsin',
    'Villanova',
    'Winthrop',
    'Purdue',
    'North Texas',
    'Texas Tech',
    'Utah St',
    'Arkansas',
    'Colgate',
    'Florida',
    'Virginia Tech',
    'Ohio St',
    'Oral Roberts'
  ],
  midwest: [
    'Illinois',
    'Drexel',
    'Loyola',
    'Georgia Tech',
    'Tennessee',
    'Oregon St',
    'Oklahoma St.',
    'Liberty',
    'San Diego St.',
    'Syracuse',
    'West Virginia',
    'Morehead St.',
    'Clemson',
    'Rutgers',
    'Houston',
    'Cleveland St'
  ]
};

const getSpacer = (classes) => <li className={classes}>&nbsp;</li>;

function BracketItem(props) {
  const { classes, withSpacer, teamObj, click } = props;
  const [variant, setVariant] = useState(
    teamObj.win ? 'contained' : 'outlined'
  );
  if (variant === 'contained' && !teamObj.win) setVariant('outlined');

  useEffect(() => {
    if (variant === 'contained' && !teamObj.win) {
      setVariant('outlined');
    }

    if (variant === 'outlined' && teamObj.win) {
      setVariant('contained');
    }
  });

  const buttonClick = () => {
    if (!teamObj.team || !teamObj.parent) return;

    teamObj.toggleWin();
    setVariant(teamObj.win ? 'contained' : 'outlined');
    click();
  };

  const item = (
    <li className={classes}>
      {teamObj.side === 'left' && <div className='dash' />}
      <Button onClick={buttonClick} variant={variant}>
        {teamObj.team ? teamObj.team : ''}
      </Button>
      {teamObj.side === 'right' && <div className='dash' />}
    </li>
  );

  return withSpacer ? (
    <>
      {getSpacer('spacer ' + classes)}
      {item}
    </>
  ) : (
    item
  );
}

BracketItem.propTypes = {
  teamObj: PropTypes.object.isRequired,
  click: PropTypes.func.isRequired,
  classes: PropTypes.string.isRequired,
  withSpacer: PropTypes.bool
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

  toggleWin() {
    if (this.win) {
      let curr = this.parent;
      while (curr && curr.team && curr.team === this.team) {
        curr.team = null;
        curr.win = false;
        curr = curr.parent;
      }
    } else if (this.parent) {
      if (this.parent.lowerChild.win) this.parent.lowerChild.toggleWin();
      if (this.parent.upperChild.win) this.parent.upperChild.toggleWin();
      this.parent.team = this.team;
    }

    this.win = !this.win;
  }
}

/**
 * Builds a round for left side of bracket (2 existing children merge to 1 parent)
 * @param   {<array>}  roundArr array of children from previous round
 * @param   {<number>} roundNumber number of the current round
 * @return  {<array>}          array of nodes for current round
 */
function buildRoundLeft(roundArr, roundNumber, teamArr) {
  let currNode;

  return roundArr.reduce((prev, team, i) => {
    const isEven = i % 2 === 0;
    isEven
      ? (currNode = new Node(
          teamArr ? teamArr.shift() : null,
          roundNumber,
          'left'
        ))
      : prev.push(currNode);
    currNode[isEven ? 'upperChild' : 'lowerChild'] = roundArr[i];
    roundArr[i].parent = currNode;
    if (teamArr && roundArr[i].team === currNode.team) roundArr[i].win = true;
    return prev;
  }, []);
}

/**
 * Builds a round for right side of bracket (1 existing parent to 2 children)
 * @param   {<array>}  parentArr array of parents from previous round
 * @param   {<number>} roundNumber number of the current round
 * @param   {<boolean>}isSeed  bool if it's a seed round
 * @param   {<array>}  seed   array of seed nodes
 * @return  {<array>}          array of nodes for current round
 */
function buildRight(parentArr, roundNumber, seed) {
  let counter = 0;

  return parentArr.reduce((prev, parent) => {
    parent.upperChild = new Node(
      seed ? seed[counter++] : null,
      roundNumber,
      'right',
      parent
    );
    parent.lowerChild = new Node(
      seed ? seed[counter++] : null,
      roundNumber,
      'right',
      parent
    );
    if (parent.team && parent.team === parent.upperChild.team)
      parent.upperChild.win = true;
    if (parent.team && parent.team === parent.lowerChild.team)
      parent.lowerChild.win = true;
    return [...prev, parent.upperChild, parent.lowerChild];
  }, []);
}

function renderTree(root, refreshBracket) {
  const rounds = [];

  let elemArr = [];
  let i = 0;
  let isLeft = true;
  let holder = [root.upperChild];
  let temp = [];

  while (holder.length > 0) {
    let team = holder[i];
    elemArr.push(
      <BracketItem
        classes={`${isLeft ? 'left' : 'right'} ${i % 2 === 0 ? 'even' : 'odd'}`}
        withSpacer={true}
        teamObj={team}
        click={refreshBracket}
      />
    );

    if (team && team.upperChild && team.lowerChild)
      temp.push(team.upperChild, team.lowerChild);
    i++;

    if (i === holder.length) {
      elemArr.push(getSpacer('spacer'));
      isLeft ? rounds.unshift(elemArr) : rounds.push(elemArr);
      holder = temp;
      temp = [];
      elemArr = [];
      i = 0;

      if (holder.length === 0 && isLeft) {
        isLeft = false;
        rounds[rounds.length - 1].pop();
        rounds[rounds.length - 1].push(
          <BracketItem
            classes={'game-top final'}
            withSpacer={true}
            teamObj={root}
            click={refreshBracket}
          />,
          <BracketItem
            classes={'right even'}
            withSpacer={true}
            teamObj={root.lowerChild}
            click={refreshBracket}
          />,
          getSpacer('spacer')
        );
        holder = [root.lowerChild.upperChild, root.lowerChild.lowerChild];
      }
    }
  }
  return rounds;
}

export default function Bracket(props) {
  let [rounds, setRounds] = useState([]);
  const { selectedWinners } = props;
  const [selectedBracket, setSelectedBracket] = useState(props.selectedWinners);

  useEffect(() => {
    if (selectedBracket !== props.selectedWinners) {
      setSelectedBracket(props.selectedWinners);
      refreshBracket();
    }
  });

  let rootNode = buildTree();

  function buildTree() {
    let holder = [...starterGames.west, ...starterGames.east].map(
      (team) => new Node(team, 1, 'left')
    );
    const leftRounds = [];
    const rightRounds = [];
    const winner = selectedWinners ? selectedWinners.winner : null;

    if (selectedWinners && selectedWinners.winner) {
      leftRounds.push(selectedWinners.roundOne.slice(0, 16));
      rightRounds.unshift(selectedWinners.roundOne.slice(16));
      leftRounds.push(selectedWinners.roundTwo.slice(0, 8));
      rightRounds.unshift(selectedWinners.roundTwo.slice(8));
      leftRounds.push(selectedWinners.roundThree.slice(0, 4));
      rightRounds.unshift(selectedWinners.roundThree.slice(4));
      leftRounds.push(selectedWinners.roundFour.slice(0, 2));
      rightRounds.unshift(selectedWinners.roundFour.slice(2));
      leftRounds.push(selectedWinners.roundFive.slice(0, 1));
      rightRounds.unshift(selectedWinners.roundFive.slice(1));
    }

    for (let i = 2; i < 7; i++) {
      holder = buildRoundLeft(
        holder,
        i,
        leftRounds.length > 0 ? leftRounds[i - 2] : null
      );
    }

    let root = new Node(winner, 7, 'center');
    root.upperChild = holder[0];
    root.upperChild.parent = root;
    root.lowerChild = new Node(
      rightRounds.length > 0 ? rightRounds.shift()[0] : null,
      6,
      'right',
      root
    );
    if (root.lowerChild.team && root.lowerChild.team === root.team)
      root.lowerChild.win = true;
    if (root.upperChild.team && root.upperChild.team === root.team)
      root.upperChild.win = true;
    holder = [root.lowerChild];

    for (let j = 5; j >= 2; j--) {
      holder = buildRight(
        holder,
        j,
        rightRounds.length > 0 ? rightRounds.shift() : null
      );
    }
    buildRight(holder, 1, [...starterGames.south, ...starterGames.midwest]);

    if (rounds.length === 0) refreshBracket(root);
    return root;
  }

  function refreshBracket(root = rootNode) {
    setRounds(renderTree(root, refreshBracket));
  }

  function getRoundWinners() {
    if (rounds.length === 0) return;
    // rounds is 11
    const roundOne = [...rounds[1].slice(0, -1), ...rounds[9].slice(0, -1)].map(
      (el) => el?.props?.teamObj?.team
    );
    const roundTwo = [...rounds[2].slice(0, -1), ...rounds[8].slice(0, -1)].map(
      (el) => el?.props?.teamObj?.team
    );
    const roundThree = [
      ...rounds[3].slice(0, -1),
      ...rounds[7].slice(0, -1)
    ].map((el) => el?.props?.teamObj?.team);
    const roundFour = [
      ...rounds[4].slice(0, -1),
      ...rounds[6].slice(0, -1)
    ].map((el) => el?.props?.teamObj?.team);
    const roundFive = [rounds[5][0], rounds[5][2]].map(
      (el) => el?.props?.teamObj?.team
    );
    const overall = rounds[5][1]?.props?.teamObj?.team;

    props.setWinners(
      roundOne,
      roundTwo,
      roundThree,
      roundFour,
      roundFive,
      overall
    );
  }
  getRoundWinners();

  return (
    <div className='tournament'>
      {rounds.map((round, i) => {
        const classes = `round round-${i <= 5 ? i : Math.abs(i - 10)}`;
        return <ul className={classes}> {round.map((item) => item)} </ul>;
      })}
    </div>
  );
}

Bracket.propTypes = {
  setWinners: PropTypes.func.isRequired,
  selectedWinners: PropTypes.object
};
