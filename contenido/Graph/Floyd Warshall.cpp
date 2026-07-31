// Floyd-Warshall
// O(n^3)
// Shortest paths between all pairs.
// n<=500

void solve() {
    int n, m, q;
    cin >> n >> m >> q;

    vector<vector<ll>> dist(n + 1, vector<ll>(n + 1, INF));
    for (int i = 1; i <= n; i++) dist[i][i] = 0;

    while (m--) {
        int u, v;
        ll w;
        cin >> u >> v >> w;
        dist[u][v] = min(dist[u][v], w);
        dist[v][u] = min(dist[v][u], w); // Eliminar si es dirigido
    }

    for (int k = 1; k <= n; k++)
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= n; j++)
                if (dist[i][k] != INF && dist[k][j] != INF)
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);

    while (q--) {
        int u, v;
        cin >> u >> v;
        // muestra el camino mas corto entre u y v, o -1 si no hay camino
        cout << (dist[u][v] == INF ? -1 : dist[u][v]) << '\n'; 
    }
}