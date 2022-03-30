## Προαπαιτούμενα
Πρέπει να είναι εγκατεστημένα:
- `node.js`
- `npm` (Κατεβαίνει μαζί με το `node.js`)

## Εγκατάσταση dependencies και εκτέλεση
- Εγκατάσταση dependencies για την εφαρμογή του `client`
  ```sh
  $ cd ./frontend
  $ npm install
  ```
- Εγκατάσταση dependencies για την εφαρμογή του `server`
  ```sh
  $ cd ./verovio-rest-api
  $ npm install
  ```
- Παραγωγή client build στο server
  ```sh
  $ npm run local:build-client
  ```
- Εκκίνηση του server (persistence σε `SQLite`)
  ```sh
  $ npm run dev-sqlite
  ```