/* Trie or Prefix Tree  es una estructura de datos que se utiliza para almacenar 
y recuperar eficientemente claves en un conjunto de cadenas. Hay varias aplicaciones 
de esta estructura de datos, como la autocompletado y el verificador ortográfico. */
struct Trie{

    struct Node{    // cada nodo del trie tiene 26 hijos, uno para cada letra del alfabeto 
        Node* child[26];
        bool isWord;

        Node(){     // constructor del nodo
            isWord = false;
            for(int i = 0; i < 26; i++)
                child[i] = nullptr;
        }
    };

    Node* root;

    Trie(){  // constructor del trie, inicializa la raíz en un nuevo nodo
        root = new Node();
    }

    void insert(const string &s){   // inserta una palabra en el trie
        Node* cur = root;

        for(char c : s){
            int id = c - 'a';

            if(cur->child[id] == nullptr)
                cur->child[id] = new Node();

            cur = cur->child[id];
        }

        cur->isWord = true;
    }

    bool search(const string &s){   // busca una palabra en el trie, 
        Node* cur = root;

        for(char c : s){
            int id = c - 'a';

            if(cur->child[id] == nullptr)
                return false;

            cur = cur->child[id];
        }

        return cur->isWord;
    }

    bool startsWith(const string &s){   // busca un prefijo en el trie
        Node* cur = root;

        for(char c : s){
            int id = c - 'a';

            if(cur->child[id] == nullptr)
                return false;

            cur = cur->child[id];
        }

        return true;
    }

    void erase(const string &s){    // elimina una palabra del trie
        Node* cur = root;

        for(char c : s){
            int id = c - 'a';

            if(cur->child[id] == nullptr)
                return;

            cur = cur->child[id];
        }

        cur->isWord = false;
    }
};

int main(){ // ejemplo de uso del trie
    Trie trie;
    trie.insert("hello");
    trie.insert("world");
    cout << trie.search("hello") << endl; // true
    cout << trie.search("world") << endl; // true
    cout << trie.search("hell") << endl;  // false
    cout << trie.startsWith("hell") << endl; // true
    cout << trie.startsWith("worl") << endl; // true
    cout << trie.startsWith("test") << endl; // false
    trie.erase("hello");
    cout << trie.search("hello") << endl; // false
}