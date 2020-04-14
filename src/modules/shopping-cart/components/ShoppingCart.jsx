// @flow
import React from 'react';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import TopBanner from '../../../elements/TopBanner/TopBanner';

export const useStyles = makeStyles((theme) => ({
  shoppingCartWrap: {
    marginTop: -theme.spacing(8),
  },
  cardContent: {
    minHeight: '250px',
  },
}));

export default function ShoppingCart() {
  const classes = useStyles();

  return (
    <Grid container>
      <TopBanner/>
      <Grid
        container
        item
        xs={12}
        direction="row"
        justify="center"
        alignItems="center">

        <Container className={classes.shoppingCartWrap}>
          <Card>
            <CardContent className={classes.cardContent}>
              Hola
            </CardContent>
          </Card>
        </Container>

      </Grid>
    </Grid>
  );
}