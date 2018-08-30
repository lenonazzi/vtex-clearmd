# vtex-clearmd

🚀 Clear VTEX Master Data documents made easy.

## Getting started

Clone the repository to your local machine.

```shell
git clone https://github.com/lenonazzi/vtex-clearmd.git
```

Go to your terminal, change current folder to the one you've cloned the repo then run:

```shell
npm start
```

Follow the steps and wait until the magic is complete.

_PS: Also you can run the script again by typing "**y**" after the process is complete._

### Setup items

| Item         |    Default   | Description                                                                                                                         |
|--------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------|
| store        |    mystore   | Store name                                                                                                                          |
| acronym      |      SL      | Entity acronym                                                                                                                      |
| fields       |    id,nome   | Fields to search. We need 2 required fields: id of the document and name/label to show on logs. Fields must be separated by commas. |
| vtexAppKey   | my@email.com | Vtex App Key                                                                                                                        |
| vtexAppToken |              | Vtex App Token                                                                                                                      |


#### Take note

You can delete only 999 documents by time because of the REST-Range so just run the script again to delete more.

## License

MIT
