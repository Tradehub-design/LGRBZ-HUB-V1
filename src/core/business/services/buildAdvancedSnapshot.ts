import type {

Portfolio

} from "@/core/portfolio/types";

import {

buildStatistics

} from "../performance/statistics";

export function buildAdvancedSnapshot(

portfolio:Portfolio

){

return{

statistics:

buildStatistics(

portfolio.holdings

),

generated:

new Date()

.toISOString()

};

}
