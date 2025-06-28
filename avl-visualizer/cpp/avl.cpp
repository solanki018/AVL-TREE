#include <emscripten.h>
#include <emscripten/bind.h>
#include <string>
#include <sstream>
#include <algorithm>
using namespace emscripten;
// using namespace emscripten; // moved after includes for select_overload
using namespace emscripten;

struct Node {
    int val;
    int height;
    Node* left;
    Node* right;

    Node(int x) : val(x), height(1), left(nullptr), right(nullptr) {}
};

class AVLTree {
private:
    Node* root = nullptr;

    int height(Node* n) {
        return n ? n->height : 0;
    }

    int getBalance(Node* n) {
        return n ? height(n->left) - height(n->right) : 0;
    }

    Node* rightRotate(Node* y) {
        Node* x = y->left;
        Node* T2 = x->right;
        x->right = y;
        y->left = T2;

        y->height = std::max(height(y->left), height(y->right)) + 1;
        x->height = std::max(height(x->left), height(x->right)) + 1;

        return x;
    }

    Node* leftRotate(Node* x) {
        Node* y = x->right;
        Node* T2 = y->left;
        y->left = x;
        x->right = T2;

        x->height = std::max(height(x->left), height(x->right)) + 1;
        y->height = std::max(height(y->left), height(y->right)) + 1;

        return y;
    }

    Node* insert(Node* node, int key) {
        if (!node) return new Node(key);
        if (key < node->val)
            node->left = insert(node->left, key);
        else if (key > node->val)
            node->right = insert(node->right, key);
        else
            return node;

        node->height = 1 + std::max(height(node->left), height(node->right));
        int balance = getBalance(node);

        if (balance > 1 && key < node->left->val)
            return rightRotate(node);
        if (balance < -1 && key > node->right->val)
            return leftRotate(node);
        if (balance > 1 && key > node->left->val) {
            node->left = leftRotate(node->left);
            return rightRotate(node);
        }
        if (balance < -1 && key < node->right->val) {
            node->right = rightRotate(node->right);
            return leftRotate(node);
        }

        return node;
    }

    Node* minValueNode(Node* node) {
        Node* current = node;
        while (current->left != nullptr)
            current = current->left;
        return current;
    }

    Node* deleteNode(Node* root, int key) {
        if (!root) return root;

        if (key < root->val)
            root->left = deleteNode(root->left, key);
        else if (key > root->val)
            root->right = deleteNode(root->right, key);
        else {
            if (!root->left || !root->right) {
                Node* temp = root->left ? root->left : root->right;
                if (!temp) {
                    temp = root;
                    root = nullptr;
                } else
                    *root = *temp;
                delete temp;
            } else {
                Node* temp = minValueNode(root->right);
                root->val = temp->val;
                root->right = deleteNode(root->right, temp->val);
            }
        }

        if (!root) return root;

        root->height = 1 + std::max(height(root->left), height(root->right));
        int balance = getBalance(root);

        if (balance > 1 && getBalance(root->left) >= 0)
            return rightRotate(root);
        if (balance > 1 && getBalance(root->left) < 0) {
            root->left = leftRotate(root->left);
            return rightRotate(root);
        }
        if (balance < -1 && getBalance(root->right) <= 0)
            return leftRotate(root);
        if (balance < -1 && getBalance(root->right) > 0) {
            root->right = rightRotate(root->right);
            return leftRotate(root);
        }

        return root;
    }

    bool searchNode(Node* node, int key) {
        if (!node) return false;
        if (key == node->val) return true;
        if (key < node->val) return searchNode(node->left, key);
        return searchNode(node->right, key);
    }

    void serializeTree(Node* root, std::ostringstream& out) {
        if (!root) return;
        out << "{\"val\":" << root->val << ",\"left\":";
        if (root->left) serializeTree(root->left, out);
        else out << "null";

        out << ",\"right\":";
        if (root->right) serializeTree(root->right, out);
        else out << "null";

        out << "}";
    }

public:
    void insert(int key) {
        root = insert(root, key);
    }

    void deleteKey(int key) {
        root = deleteNode(root, key);
    }

    bool search(int key) {
        return searchNode(root, key);
    }

    std::string getTreeJSON() {
        std::ostringstream out;
        serializeTree(root, out);
        return out.str();
    }
};

EMSCRIPTEN_BINDINGS(my_module) {
    class_<AVLTree>("AVLTree")
        .constructor<>()
        .function("insert", select_overload<void(int)>(&AVLTree::insert))
        .function("deleteKey", &AVLTree::deleteKey)
        .function("search", &AVLTree::search)
        .function("getTreeJSON", &AVLTree::getTreeJSON);
}

