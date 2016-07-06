import * as React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import {
  IconButton,
  RaisedButton,
} from 'material-ui';
import AvPlayCircleOutline from 'material-ui/svg-icons/av/play-circle-outline';
import AvPauseCircleOutline from 'material-ui/svg-icons/av/pause-circle-outline';

import { startTask, stopTask } from '../actions/tasks';
import * as m from '../models';
import { IViewTask } from '../selectors';
import * as routes from '../utils/routes';
import * as c from './theme/colors';

interface IStartTaskButtonProps {
  onStartTask?: (task: m.ITask) => void;
  onStopTask?: (task: m.ITask) => void;
  task: IViewTask;
}

interface IConnectedStartTaskButtonProps extends IStartTaskButtonProps {
  startTask: (task: m.ITask) => void;
  stopTask: (task: m.ITask) => void;
}

const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  startTask: (task: m.ITask) => dispatch(startTask(task)),
  stopTask: (task: m.ITask) => dispatch(stopTask(task)),
});

const style = {
  playPauseIcon: {
    display: 'inline-block',
    fill: c.white,
    height: '24px',
    width: '24px',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    verticalAlign: 'middle',
    marginLeft: '12px',
    marginRight: 0,
  },
  text: {
    fontSize: '14px',
    letterSpacing: 0,
    fontWeight: 500,
    margin: 0,
    paddingLeft: '8px',
    paddingRight: '16px',
  }
};

const handleStartTask = (props) =>
  props.startTask(props.task).then(() => {
    if (props.onStartTask) {
      props.onStartTask(props.task);
    }
  })

const handleStopTask = (props) =>
  props.stopTask(props.task).then(() => {
    if (props.onStopTask) {
      props.onStopTask(props.task);
    }
  })

const StartTaskButton = (props: IStartTaskButtonProps) => {
  const { task } = props;
  const activeSession = task.activeSession;

  if (activeSession) {
    return (
      <RaisedButton
        style={{ minWidth: '105px' }}
        primary={true}
        onTouchTap={() => handleStopTask(props)}>
        <div style={{color: c.white}}>
          <AvPauseCircleOutline style={style.playPauseIcon} />
          <span style={style.text}>Pause</span>
        </div>
      </RaisedButton>
    );
  } else {
    return (
      <RaisedButton
        style={{ minWidth: '105px' }}
        primary={true}
        onTouchTap={() => handleStartTask(props)}>
        <div style={{color: c.white}}>
          <AvPlayCircleOutline style={style.playPauseIcon} />
          <span style={style.text}>Start</span>
        </div>
      </RaisedButton>
    );
  }
};

export default connect<{}, {}, IStartTaskButtonProps>(
  state => state,
  mapDispatchToProps
)(StartTaskButton);
