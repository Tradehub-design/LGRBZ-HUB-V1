import type {
  MarketDataProviderAdapter,
  ProviderAdapterRegistry,
} from "../marketDataAdapterTypes";
import type {
  MarketDataProviderId,
} from "../marketDataTypes";
import {
  AlphaVantageQuoteAdapter,
} from "./alphaVantageQuoteAdapter";
import {
  FinnhubQuoteAdapter,
} from "./finnhubQuoteAdapter";
import {
  TwelveDataQuoteAdapter,
} from "./twelveDataQuoteAdapter";
import {
  YahooFinanceQuoteAdapter,
} from "./yahooFinanceQuoteAdapter";

export class DefaultProviderAdapterRegistry
implements ProviderAdapterRegistry {
  private readonly adapters =
    new Map<
      MarketDataProviderId,
      MarketDataProviderAdapter
    >();

  register(
    adapter:
      MarketDataProviderAdapter
  ): void {
    this.adapters.set(
      adapter.providerId,
      adapter
    );
  }

  unregister(
    provider:
      MarketDataProviderId
  ): boolean {
    return this.adapters.delete(
      provider
    );
  }

  get(
    provider:
      MarketDataProviderId
  ): MarketDataProviderAdapter | null {
    return (
      this.adapters.get(
        provider
      ) ||
      null
    );
  }

  has(
    provider:
      MarketDataProviderId
  ): boolean {
    return this.adapters.has(
      provider
    );
  }

  all():
    MarketDataProviderAdapter[] {
    return Array.from(
      this.adapters.values()
    );
  }

  clear(): void {
    this.adapters.clear();
  }
}

export function createDefaultProviderAdapterRegistry():
  DefaultProviderAdapterRegistry {
  const registry =
    new DefaultProviderAdapterRegistry();

  registry.register(
    new YahooFinanceQuoteAdapter()
  );

  registry.register(
    new FinnhubQuoteAdapter()
  );

  registry.register(
    new TwelveDataQuoteAdapter()
  );

  registry.register(
    new AlphaVantageQuoteAdapter()
  );

  return registry;
}

let sharedProviderAdapterRegistry:
  DefaultProviderAdapterRegistry | null =
    null;

export function getSharedProviderAdapterRegistry():
  DefaultProviderAdapterRegistry {
  if (
    !sharedProviderAdapterRegistry
  ) {
    sharedProviderAdapterRegistry =
      createDefaultProviderAdapterRegistry();
  }

  return sharedProviderAdapterRegistry;
}

export function resetSharedProviderAdapterRegistry():
  DefaultProviderAdapterRegistry {
  sharedProviderAdapterRegistry =
    createDefaultProviderAdapterRegistry();

  return sharedProviderAdapterRegistry;
}
