import type {
  MarketDataCacheSnapshot,
  MarketDataPersistentCacheAdapter,
} from "./marketDataCacheTypes";

type FileSystemModule = {
  promises: {
    readFile(
      path: string,
      encoding: "utf8"
    ):
      Promise<string>;

    writeFile(
      path: string,
      content: string,
      encoding: "utf8"
    ):
      Promise<void>;

    mkdir(
      path: string,
      options: {
        recursive: true;
      }
    ):
      Promise<unknown>;

    rm(
      path: string,
      options: {
        force: true;
      }
    ):
      Promise<void>;
  };
};

type PathModule = {
  dirname(
    path: string
  ): string;
};

function validSnapshot(
  value: unknown
): value is MarketDataCacheSnapshot {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return false;
  }

  const candidate =
    value as
      Partial<
        MarketDataCacheSnapshot
      >;

  return (
    candidate.version ===
      1 &&
    Array.isArray(
      candidate.entries
    ) &&
    Boolean(
      candidate.statistics
    )
  );
}

export class LocalStorageMarketDataCacheAdapter
implements MarketDataPersistentCacheAdapter {
  readonly name =
    "Local Storage Market Data Cache";

  readonly source =
    "LOCAL_STORAGE" as const;

  constructor(
    private readonly storageKey =
      "lgrbz.market-data-cache.v1"
  ) {}

  available():
    boolean {
    return (
      typeof window !==
        "undefined" &&
      typeof window.localStorage !==
        "undefined"
    );
  }

  load():
    MarketDataCacheSnapshot | null {
    if (
      !this.available()
    ) {
      return null;
    }

    try {
      const raw =
        window.localStorage.getItem(
          this.storageKey
        );

      if (
        !raw
      ) {
        return null;
      }

      const parsed =
        JSON.parse(
          raw
        ) as unknown;

      return validSnapshot(
        parsed
      )
        ? parsed
        : null;
    } catch {
      return null;
    }
  }

  save(
    snapshot:
      MarketDataCacheSnapshot
  ): void {
    if (
      !this.available()
    ) {
      return;
    }

    try {
      window.localStorage.setItem(
        this.storageKey,
        JSON.stringify(
          snapshot
        )
      );
    } catch {
      // Storage quota errors must not break quote resolution.
    }
  }

  clear(): void {
    if (
      !this.available()
    ) {
      return;
    }

    try {
      window.localStorage.removeItem(
        this.storageKey
      );
    } catch {
      // Ignore browser storage errors.
    }
  }
}

export class FileMarketDataCacheAdapter
implements MarketDataPersistentCacheAdapter {
  readonly name =
    "File Market Data Cache";

  readonly source =
    "FILE" as const;

  constructor(
    private readonly filePath =
      ".cache/market-data/quotes.json"
  ) {}

  available():
    boolean {
    return (
      typeof window ===
      "undefined"
    );
  }

  private async modules():
    Promise<{
      fs:
        FileSystemModule;
      path:
        PathModule;
    }> {
    const fs =
      await import(
        "node:fs"
      ) as unknown as
        FileSystemModule;

    const path =
      await import(
        "node:path"
      ) as unknown as
        PathModule;

    return {
      fs,
      path,
    };
  }

  async load():
    Promise<MarketDataCacheSnapshot | null> {
    if (
      !this.available()
    ) {
      return null;
    }

    try {
      const {
        fs,
      } =
        await this.modules();

      const raw =
        await fs.promises.readFile(
          this.filePath,
          "utf8"
        );

      const parsed =
        JSON.parse(
          raw
        ) as unknown;

      return validSnapshot(
        parsed
      )
        ? parsed
        : null;
    } catch {
      return null;
    }
  }

  async save(
    snapshot:
      MarketDataCacheSnapshot
  ): Promise<void> {
    if (
      !this.available()
    ) {
      return;
    }

    const {
      fs,
      path,
    } =
      await this.modules();

    await fs.promises.mkdir(
      path.dirname(
        this.filePath
      ),
      {
        recursive:
          true,
      }
    );

    await fs.promises.writeFile(
      this.filePath,
      JSON.stringify(
        snapshot,
        null,
        2
      ),
      "utf8"
    );
  }

  async clear():
    Promise<void> {
    if (
      !this.available()
    ) {
      return;
    }

    try {
      const {
        fs,
      } =
        await this.modules();

      await fs.promises.rm(
        this.filePath,
        {
          force:
            true,
        }
      );
    } catch {
      // Ignore missing file or restricted filesystem errors.
    }
  }
}

export class CompositeMarketDataCacheAdapter
implements MarketDataPersistentCacheAdapter {
  readonly name =
    "Composite Market Data Cache";

  readonly source =
    "COMPOSITE" as const;

  constructor(
    private readonly adapters:
      MarketDataPersistentCacheAdapter[]
  ) {}

  async available():
    Promise<boolean> {
    for (
      const adapter of
      this.adapters
    ) {
      if (
        await adapter.available()
      ) {
        return true;
      }
    }

    return false;
  }

  async load():
    Promise<MarketDataCacheSnapshot | null> {
    for (
      const adapter of
      this.adapters
    ) {
      if (
        !await adapter.available()
      ) {
        continue;
      }

      const snapshot =
        await adapter.load();

      if (
        snapshot
      ) {
        return snapshot;
      }
    }

    return null;
  }

  async save(
    snapshot:
      MarketDataCacheSnapshot
  ): Promise<void> {
    await Promise.allSettled(
      this.adapters.map(
        async (
          adapter
        ) => {
          if (
            await adapter.available()
          ) {
            await adapter.save(
              snapshot
            );
          }
        }
      )
    );
  }

  async clear():
    Promise<void> {
    await Promise.allSettled(
      this.adapters.map(
        async (
          adapter
        ) => {
          if (
            await adapter.available()
          ) {
            await adapter.clear();
          }
        }
      )
    );
  }
}

export function createDefaultPersistentMarketDataCacheAdapter():
  MarketDataPersistentCacheAdapter {
  if (
    typeof window !==
    "undefined"
  ) {
    return new LocalStorageMarketDataCacheAdapter();
  }

  return new FileMarketDataCacheAdapter();
}
