vector<vector<int>> adj; // lista de adyacencia
vector<bool> visited; // vector de visitados
void bfs(int start) {

    queue<int> q;

    q.push(start);
    visited[start] = true;

    while(!q.empty()) {
        
        int u = q.front();
        q.pop();

        for(int v : adj[u]) {
            if(!visited[v]) {
                visited[v] = true;
                q.push(v);

            }
        }
    }
}