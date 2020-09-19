// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  InputLabel,
  Select,
  FormControl,
  TextField,
} from '@material-ui/core';
import {useFormContext} from 'react-hook-form';

type Props = {|
  title: string,
  idPrefix: string,
  disabled?: boolean,
|};

export default function ShippingAddress(props: Props) {
  const {title, idPrefix, disabled} = props;
  const {register, errors} = useFormContext();

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              margin="none"
              required
              fullWidth
              id={`${idPrefix}-first-name`}
              label="First Name"
              name={`${idPrefix}-first-name`}
              autoComplete={`${idPrefix}-first-name`}
              error={!!errors[`${idPrefix}-first-name`]}
              helperText={
                errors[`${idPrefix}-first-name`]
                  ? errors[`${idPrefix}-first-name`].message
                  : ''
              }
              inputRef={register({
                required: 'Required',
              })}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              margin="none"
              required
              fullWidth
              id={`${idPrefix}-last-name`}
              label="Last Name"
              name={`${idPrefix}-last-name`}
              autoComplete={`${idPrefix}-last-name`}
              error={!!errors[`${idPrefix}-last-name`]}
              helperText={
                errors[`${idPrefix}-last-name`]
                  ? errors[`${idPrefix}-last-name`].message
                  : ''
              }
              inputRef={register({
                required: 'Required',
              })}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              margin="none"
              required
              fullWidth
              id={`${idPrefix}-address-1`}
              label="Address 1"
              name={`${idPrefix}-address-1`}
              autoComplete={`${idPrefix}-address-1`}
              error={!!errors[`${idPrefix}-address-1`]}
              helperText={
                errors[`${idPrefix}-address-1`]
                  ? errors[`${idPrefix}-address-1`].message
                  : ''
              }
              inputRef={register({
                required: 'Required',
              })}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              margin="none"
              required
              fullWidth
              id={`${idPrefix}-address-2`}
              label="Address 2"
              name={`${idPrefix}-address-2`}
              autoComplete={`${idPrefix}-address-2`}
              error={!!errors[`${idPrefix}-address-2`]}
              helperText={
                errors[`${idPrefix}-address-2`]
                  ? errors[`${idPrefix}-address-2`].message
                  : ''
              }
              inputRef={register()}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              margin="none"
              required
              fullWidth
              id={`${idPrefix}-city`}
              label="City"
              name={`${idPrefix}-city`}
              autoComplete={`${idPrefix}-city`}
              error={!!errors[`${idPrefix}-city`]}
              helperText={
                errors[`${idPrefix}-city`]
                  ? errors[`${idPrefix}-city`].message
                  : ''
              }
              inputRef={register({
                required: 'Required',
              })}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-state-native">State</InputLabel>
              <Select
                native
                label="State"
                inputProps={{
                  name: `${idPrefix}-state`,
                  id: 'outlined-state-native',
                  ref: register({
                    required: 'Required',
                  }),
                }}
                disabled={disabled}
              >
                <option value="AL">AL</option>
                <option value="AK">AK</option>
                <option value="AZ">AZ</option>
                <option value="AR">AR</option>
                <option value="CA">CA</option>
                <option value="CO">CO</option>
                <option value="CT">CT</option>
                <option value="DE">DE</option>
                <option value="DC">DC</option>
                <option value="FL">FL</option>
                <option value="GA">GA</option>
                <option value="HI">HI</option>
                <option value="ID">ID</option>
                <option value="IL">IL</option>
                <option value="IN">IN</option>
                <option value="IA">IA</option>
                <option value="KS">KS</option>
                <option value="KY">KY</option>
                <option value="LA">LA</option>
                <option value="ME">ME</option>
                <option value="MD">MD</option>
                <option value="MA">MA</option>
                <option value="MI">MI</option>
                <option value="MN">MN</option>
                <option value="MS">MS</option>
                <option value="MO">MO</option>
                <option value="MT">MT</option>
                <option value="NE">NE</option>
                <option value="NV">NV</option>
                <option value="NH">NH</option>
                <option value="NJ">NJ</option>
                <option value="NM">NM</option>
                <option value="NY">NY</option>
                <option value="NC">NC</option>
                <option value="ND">ND</option>
                <option value="OH">OH</option>
                <option value="OK">OK</option>
                <option value="OR">OR</option>
                <option value="PA">PA</option>
                <option value="RI">RI</option>
                <option value="SC">SC</option>
                <option value="SD">SD</option>
                <option value="TN">TN</option>
                <option value="TX">TX</option>
                <option value="UT">UT</option>
                <option value="VT">VT</option>
                <option value="VA">VA</option>
                <option value="WA">WA</option>
                <option value="WV">WV</option>
                <option value="WI">WI</option>
                <option value="WY">WY</option>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              variant="outlined"
              margin="none"
              required
              fullWidth
              id={`${idPrefix}-zip`}
              label="Zip"
              name={`${idPrefix}-zip`}
              autoComplete={`${idPrefix}-zip`}
              error={!!errors[`${idPrefix}-zip`]}
              helperText={
                errors[`${idPrefix}-zip`]
                  ? errors[`${idPrefix}-zip`].message
                  : ''
              }
              inputRef={register({
                required: 'Required',
              })}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

ShippingAddress.propTypes = {
  title: PropTypes.string.isRequired,
  idPrefix: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};
