vector<vector<int>> adj; // lista de adyacencia
vector<bool> visited; // vector de visitados
void dfs(int u) {
    visited[u] = true;

    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs(v);
        }
    }
}