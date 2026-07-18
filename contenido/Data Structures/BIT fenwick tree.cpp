struct Fenwick {
    int n;
    vector<long long> bit;

    Fenwick(vector<long long> &a) {
        n = a.size();
        bit.assign(n + 1, 0);
        for (int i = 0; i < n; i++) update(i + 1, a[i]);
    }

    // Suma 'val' en la posición 'idx'
    void update(int idx, long long val) {
        for (; idx <= n; idx += idx & -idx) bit[idx] += val;
    }

    // Suma del prefijo [1...idx]
    long long sum(int idx) {
        long long res = 0;
        for (; idx > 0; idx -= idx & -idx)
            res += bit[idx];
        return res;
    }

    // Suma del rango [l...r]
    long long query(int l, int r) {
        return sum(r) - sum(l - 1);
    }
    
};