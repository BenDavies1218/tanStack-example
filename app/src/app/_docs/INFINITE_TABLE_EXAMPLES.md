# Infinite Table Examples

This directory contains comprehensive examples of infinite scroll tables using TanStack Query with different data sources.

## Overview

All examples use the same generic `Table` component (`@/app/_components/generic-table`) but demonstrate different data fetching strategies.

```
┌──────────────────────────────────────────────────────────────┐
│                    Generic Table Component                   │
│          (Handles rendering, infinite scroll, UX)            │
└──────────────────────────────────────────────────────────────┘
                              ▲
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
    ┌─────▼────┐       ┌──────▼─────┐     ┌──────▼──────┐
    │   tRPC   │       │  Subgraph  │     │  Ethers.js  │
    │ (Type-   │       │  (GraphQL) │     │ (Direct RPC)│
    │  safe)   │       │            │     │             │
    └──────────┘       └────────────┘     └─────────────┘
```

## Example Files

### 1. **infinite-table-example.tsx** - tRPC with MongoDB/PostgreSQL
**Best for:** Internal application data, full type safety

**Features:**
- ✅ End-to-end type safety
- ✅ Automatic type inference
- ✅ Backend sorting and filtering
- ✅ Error handling with `throwOnError`
- ✅ Easy to use with T3 Stack

**Use when:**
- Building application features with your own database
- Type safety is critical
- You want minimal boilerplate

**Data source:** Your database (MongoDB/PostgreSQL via tRPC)

```typescript
// Type-safe API call - no manual types needed!
const { data } = api.infinite.getInfiniteDataMongoDB.useInfiniteQuery(
  { limit: 50, category, search, sortBy, sortOrder },
  { getNextPageParam: (lastPage) => lastPage.nextCursor }
);
```

---

### 2. **infinite-table-tanstack.tsx** - Native TanStack Query
**Best for:** REST APIs, third-party APIs

**Features:**
- ✅ Standard fetch() calls
- ✅ Works with any REST API
- ✅ Manual but flexible type definitions
- ✅ URLSearchParams for query building

**Use when:**
- Integrating with third-party REST APIs
- You don't have tRPC backend
- Need to call existing REST endpoints

**Data source:** REST API endpoints (fetch)

```typescript
// Manual type definitions required
const { data } = useInfiniteQuery<InfiniteQueryResponse, Error>({
  queryKey: ["assets", "infinite", { category, search, sortBy, sortOrder }],
  queryFn: ({ pageParam = 0 }) => fetchAssets({ cursor: pageParam, ... }),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

---

### 3. **infinite-table-subgraph.tsx** - The Graph Protocol
**Best for:** Indexed blockchain data (DeFi, NFTs, DAOs)

**Features:**
- ✅ GraphQL queries for blockchain data
- ✅ Cursor-based pagination with `id_gt`
- ✅ Efficient querying of indexed data
- ✅ Real-time-ish updates (~15 second lag)

**Use when:**
- Querying Uniswap, Aave, Compound data
- Working with NFT collections
- Need indexed historical blockchain data
- Want better performance than direct RPC

**Data source:** The Graph subgraphs (GraphQL)

```typescript
// GraphQL query with cursor pagination
const query = `
  query {
    pools(
      first: 50
      where: { id_gt: "${cursor}" }
      orderBy: totalValueLockedUSD
      orderDirection: desc
    ) {
      id
      token0 { symbol name }
      token1 { symbol name }
      volumeUSD
      totalValueLockedUSD
    }
  }
`;
```

**Popular Subgraphs:**
- Uniswap V3: `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3`
- Aave V3: `https://api.thegraph.com/subgraphs/name/aave/protocol-v3`
- ENS: `https://api.thegraph.com/subgraphs/name/ensdomains/ens`

---

### 4. **infinite-table-ethers.tsx** - Direct Blockchain Queries
**Best for:** Real-time blockchain events, custom contracts

**Features:**
- ✅ Direct RPC queries with ethers.js
- ✅ Real-time event listening
- ✅ Works with any smart contract
- ✅ Block-based pagination

**Use when:**
- Need real-time blockchain data
- Working with custom/new contracts (not indexed yet)
- Small block ranges (recent data only)
- Have good RPC provider (Infura/Alchemy)

**Data source:** Ethereum RPC (ethers.js)

```typescript
// Direct contract event queries
const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
const logs = await contract.queryFilter(
  contract.filters.Transfer(),
  fromBlock,
  toBlock
);
```

**⚠️ Important:** Public RPCs have strict limits (100-500 blocks). Use Infura/Alchemy for production.

---

## Comparison Matrix

| Feature | tRPC | Native TanStack | Subgraph | Ethers.js |
|---------|------|-----------------|----------|-----------|
| **Type Safety** | ✅ Full | ⚠️ Manual | ⚠️ Manual | ⚠️ Partial |
| **Setup** | Easy | Easy | Medium | Medium |
| **Data Freshness** | Real-time | Real-time | ~15s delay | Real-time |
| **Query Performance** | Fast | Fast | Fast | Slow |
| **Cost** | Server | Server | Free | RPC costs |
| **Blockchain Data** | ❌ | ❌ | ✅ | ✅ |
| **Historical Data** | ✅ | ✅ | ✅ | ⚠️ Limited |
| **Best For** | App data | REST APIs | Indexed blockchain | Recent blockchain |

## Pagination Strategies

### Cursor-based (Recommended)
Used by: All examples

```typescript
// First query
{ cursor: undefined, limit: 50 }
// Returns: { items: [...], nextCursor: "abc123" }

// Next query
{ cursor: "abc123", limit: 50 }
// Returns: { items: [...], nextCursor: "def456" }
```

**Why cursor-based?**
- ✅ Consistent results (no duplicates from new data)
- ✅ Works with real-time data
- ✅ Better performance (uses indexes)

### Offset-based (Avoid)
```typescript
// Not recommended
{ offset: 0, limit: 50 }   // First page
{ offset: 50, limit: 50 }  // Second page
```

**Problems:**
- ❌ Duplicates if new data added
- ❌ Slower (database scans)
- ❌ Not supported by The Graph

## RPC Provider Setup

For `infinite-table-ethers.tsx`, set up a reliable RPC provider:

### 1. Infura (Recommended)

```bash
# .env.local
NEXT_PUBLIC_ETH_RPC_URL=https://mainnet.infura.io/v3/YOUR_API_KEY
```

**Free tier:** 100k requests/day, 10k block range

### 2. Alchemy

```bash
# .env.local
NEXT_PUBLIC_ETH_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

**Free tier:** Generous limits, 10k block range

### 3. QuickNode

```bash
# .env.local
NEXT_PUBLIC_ETH_RPC_URL=https://your-endpoint.quiknode.pro/YOUR_TOKEN/
```

**Features:** Enterprise features, global edge network

## Block Range Guidelines

Different RPC providers have different limits:

| Provider | Block Range | Rate Limit |
|----------|-------------|------------|
| Public RPCs | 100-500 | Very low |
| Infura | 10,000 | 100k req/day |
| Alchemy | 10,000 | Generous |
| QuickNode | 10,000+ | Plan-based |
| Private Node | 50,000+ | Unlimited |

Adjust `BLOCKS_PER_QUERY` in `infinite-table-ethers.tsx` based on your provider:

```typescript
// Public RPC
const BLOCKS_PER_QUERY = 100;

// Infura/Alchemy
const BLOCKS_PER_QUERY = 5000;

// Private node
const BLOCKS_PER_QUERY = 50000;
```

## Performance Tips

### 1. **Use Appropriate Data Source**
- Application data → tRPC
- REST APIs → Native TanStack Query
- Indexed blockchain → Subgraph
- Recent blockchain events → Ethers.js

### 2. **Optimize Query Keys**
```typescript
// Good - specific key structure
queryKey: ["assets", "infinite", { category, search, sortBy }]

// Bad - too generic
queryKey: ["assets"]
```

### 3. **Set Appropriate staleTime**
```typescript
// Fast-changing data (blockchain)
staleTime: 12 * 1000 // 12 seconds

// Slow-changing data (indexed)
staleTime: 5 * 60 * 1000 // 5 minutes
```

### 4. **Use useMemo for Data Transformation**
```typescript
const allItems = useMemo(
  () => tableData?.pages.flatMap((page) => page.items) ?? [],
  [tableData]
);
```

### 5. **Implement Error Boundaries**
All examples include error handling with toast notifications.

## Common Issues

### Issue: "Range is too large"
**Solution:** Reduce `BLOCKS_PER_QUERY` or upgrade RPC provider

### Issue: Too many requests
**Solution:** Increase `staleTime` to cache queries longer

### Issue: Duplicate data in table
**Solution:** Ensure unique keys in renderRow: `key={item.uniqueId}`

### Issue: Slow initial load
**Solution:** Reduce `pageLimit` from 50 to 20

## Next Steps

1. **Choose the right example** for your use case
2. **Copy and customize** the component
3. **Adjust pagination parameters** based on your data volume
4. **Add custom filtering/sorting** as needed
5. **Test with production data volumes**

## Related Documentation

- [Generic Table Component](./GENERIC_TABLE.md)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [The Graph Docs](https://thegraph.com/docs/)
- [Ethers.js Docs](https://docs.ethers.org/)
