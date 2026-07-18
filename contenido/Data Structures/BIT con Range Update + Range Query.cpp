struct FenwickRange {
    int n;
    vector<long long> bit1, bit2;

    FenwickRange(int n) : n(n) {
        bit1.assign(n + 1, 0);
        bit2.assign(n + 1, 0);
    }

    void add(vector<long long>& bit, int idx, long long val) {
        while(idx <= n) {
            bit[idx] += val;
            idx += idx & -idx;
        }
    }

    long long sum(vector<long long>& bit, int idx) {
        long long res = 0;

        while(idx > 0) {
            res += bit[idx];
            idx -= idx & -idx;
        }

        return res;
    }


    // agrega val a todo el rango [l,r]
    void update(int l, int r, long long val) {
        add(bit1, l, val);
        add(bit1, r + 1, -val);

        add(bit2, l, val * (l - 1));
        add(bit2, r + 1, -val * r);
    }


    // suma [1..idx]
    long long prefix(int idx) {
        return sum(bit1, idx) * idx - sum(bit2, idx);
    }


    // suma [l..r]
    long long query(int l, int r) {
        return prefix(r) - prefix(l - 1);
    }
};

int main(){
    FenwickRange fr(10); // creamos un BIT de tamaño 10
    fr.update(2, 5, 3); // agregamos 3 a todo el rango [2,5]
    cout << fr.query(1, 10) << endl; // suma de todo el rango [1,10]
    cout << fr.query(2, 5) << endl; // suma del rango [2,5]
}