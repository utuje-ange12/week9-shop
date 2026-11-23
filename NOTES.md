# Limits of useEffect fetching I noticed

- No caching: going to page 2 and back re-downloads page 1.
- No deduplication: categories are fetched on both Home and Products.
- No background refresh: data goes stale when I switch tabs and return.
- No retry/backoff: a failed request just shows an error.
- No invalidation: a locally added product disappears after changing page.