import * as React from 'react';

import { IGoal } from '../models';
import { Row } from './Flex';
import theme from './theme';
import { GOAL_REPEATS_DEFAULT } from '../models';

export interface IRepeatSelectItemProps {
  onTouchTap: (e: React.TouchEvent) => void,
  disabled?: boolean;
  isSelected: boolean;
  text: string;
}

const RepeatSelectItem = (props: IRepeatSelectItemProps) =>
  <div
    onTouchTap={props.onTouchTap}
    style={theme.RepeatSelectItem(props)}>
    {props.text}
  </div>

const WEEKDAYS = "MTWTFSS".split('');

interface IGoalRepeatSelectProps {
  repeats: Array<boolean>;
  disabled?: boolean;
}

class RepeatSelect extends React.Component<IGoalRepeatSelectProps, IGoalRepeatSelectProps> {
  constructor(props) {
    super(props);
    this.state = {
      repeats: props.repeats,
    };
  }

  handleItemTouchTap = (index) => {
    if (this.props.disabled) {
      return;
    }

    const repeats = this.state.repeats.slice();
    repeats[index] = !repeats[index];

    this.setState({ repeats });
  }

  getRepeats(): Array<boolean> {
    return this.props.disabled ? GOAL_REPEATS_DEFAULT : this.state.repeats;
  }

  render() {
    return (
      <Row style={{ justifyContent: 'space-between' }}>
        {this.renderItems()}
      </Row>
    );
  }

  renderItems() {
    return WEEKDAYS.map((day, index) =>
      <RepeatSelectItem
        key={index}
        disabled={this.props.disabled}
        text={day}
        isSelected={this.state.repeats[index]}
        onTouchTap={() => this.handleItemTouchTap(index)}
      />
    );
  }
}

export default RepeatSelect;
