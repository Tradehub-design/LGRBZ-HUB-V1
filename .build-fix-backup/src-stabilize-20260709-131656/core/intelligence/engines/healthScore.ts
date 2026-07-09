import type {

PortfolioSnapshot

} from "@/core/business/models/PortfolioSnapshot";

export function buildHealthScore(

snapshot:PortfolioSnapshot

){

const diversification=

Math.min(

100,

snapshot.positions*8

);

const growth=

snapshot.returnPercent>0

?80

:50;

const income=

snapshot.dividends>0

?75

:40;

const risk=

snapshot.returnPercent<-20

?35

:75;

const quality=

(diversification+

growth+

income+

risk)/4;

return{

overall:quality,

diversification,

income,

risk,

growth,

quality

};

}

