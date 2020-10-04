// @flow
import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {makeStyles} from '@material-ui/core';

type Props = {|
  step?: string,
|};

export const useStyles = makeStyles(theme => ({
  stepper: {
    width: '100%',
  },
}));

const stepsInfo = [
  {
    status: 'CREATED',
    label: 'Pay',
  },
  {
    status: 'VERIFYING_PAYMENT',
    label: 'Verifying Payment',
  },
  {
    status: 'PAID',
    label: 'On Route',
  },
  {
    status: 'DELIVERED',
    label: 'Delivered',
  },
  {
    status: 'COMPLETE',
    label: 'Complete',
  },
];

export function StepProgress(props: Props) {
  const {step} = props;

  const classes = useStyles();

  const activeStep = useMemo(() => {
    if (!step) return -1;
    const s = stepsInfo.findIndex(({status}) => status === step);
    if (s === -1) return -1;
    return s;
  }, [step]);

  return (
    <Stepper
      className={classes.stepper}
      alternativeLabel
      activeStep={activeStep}
    >
      {stepsInfo.map(({status, label}) => (
        <Step key={status}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

StepProgress.propTypes = {
  step: PropTypes.string,
};
