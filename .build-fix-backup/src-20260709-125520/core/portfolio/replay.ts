import portfolioCalculator from "./calculator";

import {
  Portfolio,
  PortfolioTransaction,
  ReplaySnapshot
} from "./types";

export function buildReplaySnapshot(

  portfolio:Portfolio,

  replayDate:string

):ReplaySnapshot{

  const transactions=

    portfolio.transactions.filter(

      t=>

        new Date(t.date)<=

        new Date(replayDate)

    );

  const replay=

    portfolioCalculator.calculate(

      transactions

    );


  return{

    date:replayDate,

    holdings:
      replay.portfolio.holdings,

    cash:
      replay.portfolio.cash,

    performance:
      replay.portfolio.performance,

    equity:

      replay.portfolio.performance

        .allTime

        .marketValue+

      replay.portfolio.cash

        .totalCash

  };

}

export default buildReplaySnapshot;

