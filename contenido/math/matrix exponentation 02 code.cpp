#define ll long long
#define MOD 1000000007 
ll fibonacci(ll n){
    if(n==1) return 1;
    if(n==2) return 2;
    ll F[2][2] = {{1,1},{1,0}};
    ll res[2][2] = {{1,0},{0,1}}; // Matriz identidad
    n -= 2; // Ya tenemos los dos primeros terminos
    while(n>0){
        if(n&1){ // Si el bit menos significativo es 1
            // Multiplicamos res por F
            ll temp[2][2];
            for(int i=0;i<2;i++){
                for(int j=0;j<2;j++){
                    temp[i][j] = (res[i][0]*F[0][j] + res[i][1]*F[1][j]) % MOD;
                }
            }
            for(int i=0;i<2;i++){
                for(int j=0;j<2;j++){
                    res[i][j] = temp[i][j];
                }
            }
        }
        // Elevamos F al cuadrado
        ll temp[2][2];
        for(int i=0;i<2;i++){
            for(int j=0;j<2;j++){
                temp[i][j] = (F[i][0]*F[0][j] + F[i][1]*F[1][j]) % MOD;
            }
        }
        for(int i=0;i<2;i++){
            for(int j=0;j<2;j++){
                F[i][j] = temp[i][j];
            }
        }
        n>>=1; // Desplazamos el exponente a la derecha para procesar el siguiente bit
    }
    return res[0][0]; // El resultado es el primer elemento de la matriz resultante
}

/*
fibonacci de 4561 es 687995182, y se calcula en O(log(4561)).
*/