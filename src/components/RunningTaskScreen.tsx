import * as React from 'react';
import { connect } from 'react-redux';

import { startTask, stopTask } from '../actions/tasks';
import * as m from '../models';
import { IAppState } from '../reducer';
import { IRouteParams } from '../router';
import { taskSelector, IViewTask } from '../selectors';
import * as c from './theme/colors';
import { Column } from './Flex';
import MotivationalQuote from './MotivationalQuote';
import Navigation from './Navigation';
import NavigationBackIcon from './NavigationBackIcon';
import { RunningTaskDuration, RunningGoalDuration } from './RunningDuration';
import { Screen, ScreenContent } from './Screen';
import StartTaskButton from './StartTaskButton';

export interface IRunningTaskScreenProps {
  task: IViewTask;
  startTask: ((task: IViewTask) => void);
  stopTask: ((task: IViewTask) => void);
  params: IRouteParams;
}

const mapStateToProps = (state: IAppState, props: IRunningTaskScreenProps) => ({
  task: taskSelector(state, props.params.taskId),
});

const mapDispatchToProps = (dispatch: Redux.Dispatch) => ({
  startTask: (task: IViewTask) => dispatch(startTask(task)),
  stopTask: (task: IViewTask) => dispatch(stopTask(task)),
});

class RunningTaskScreen extends React.Component<IRunningTaskScreenProps, {}> {
  render() {
    const { task } = this.props;
    return (
      <Screen>
        <Navigation
          leftIcon={<NavigationBackIcon />}
          rightIcon={null}
          title={task.name}
        />
        <ScreenContent style={style.screenContent}>
          <Column style={style.section}>
            <RunningTaskDuration active={!!task.activeSession} style={style.taskDuration} task={task} />
            <RunningGoalDuration active={!!task.activeSession} style={style.goalDuration} task={task} />
          </Column>
          <Column style={style.section}>
            <StartTaskButton task={task} style={style.startTaskButton} />
          </Column>
          <Column style={style.section}>
            <MotivationalQuote style={style.quote} />
          </Column>
        </ScreenContent>
      </Screen>
    );
  }
};

const style = {
  screenContent: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 0,
    marginRight: 0,
  },
  section: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  taskDuration: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  goalDuration: {
    color: c.white,
    fontSize: '16px',
  },
  startTaskButton: {
    marginBottom: '20px',
  },
  quote: {
    fontStyle: 'italic',
    lineHeight: '1.5em',
    padding: '0 16px',
    textAlign: 'center',
  },
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RunningTaskScreen);
