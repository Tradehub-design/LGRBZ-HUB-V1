import { registerImporter } from "./brokers/registry";

import { CommSecImporter } from "./brokers/commsec";
import { StakeImporter } from "./brokers/stake";
import { FusionMarketsImporter } from "./brokers/fusionMarkets";
import { BinanceImporter } from "./brokers/binance";

export function registerImporters(){

registerImporter(CommSecImporter);

registerImporter(StakeImporter);

registerImporter(FusionMarketsImporter);

registerImporter(BinanceImporter);

}
