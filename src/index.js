const inquirer = require('inquirer')
const axios = require('axios')
const ora = require('ora');
const chalk = require('chalk');

const spinner = ora();

class clearMD {
  constructor() {
    this.init()
  }

  async init() {
    const userData = await this.setup()

    this.options = userData

    this.getUrl = `https://api.vtexcrm.com.br/${this.options.store}/dataentities/${this.options.acronym}/scroll`
    this.deleteUrl = `https://api.vtex.com/${this.options.store}/dataentities/${this.options.acronym}/documents`

    this.start()
  }

  async setup() {
    const questions = [
      {
        name: 'store',
        default: 'mystore'
      },
      {
        name: 'acronym',
        default: 'ST'
      },
      {
        name: 'vtexAppKey',
        default: 'vtexappkey-store-key'
      },
      {
        type: 'password',
        name: 'vtexAppToken'
      }
    ]

    return inquirer.prompt(questions)
  }

  async start() {
    spinner.start(`Getting documents...`)

    const { headers, data } = await this.getData()

    if (headers === undefined) {
      return false
    }

    const token = headers['x-vtex-md-token']

    let dataIsEmpty = data.length > 0 ? false : true

    if (dataIsEmpty) {
      spinner.succeed(chalk.bold.green('No documents found. Process complete!'))
      return false
    }

    const documents = []
    documents.push(data)

    do {
      const { data } = await this.getData(token)

      if (data.length > 0) {
        documents.push(data)
      } else {
        dataIsEmpty = true
      }
    } while (!dataIsEmpty)

    const allDocuments = [].concat.apply([], documents)

    spinner.succeed(chalk.bold.green('All documents have been received!'))

    if (await this.confirmDelete()) {
      this.clear(allDocuments)
    }
  }

  async getData(token = null) {
    const config = {
      headers: {
        Accept: 'application/vnd.vtex.ds.v10+json',
        'Content-Type': 'application/json',
        'REST-Range': 'resources=0-999',
        'x-vtex-api-appKey': this.options.vtexAppKey,
        'x-vtex-api-appToken': this.options.vtexAppToken
      }
    }

    let response = false

    try {
      const url = token === null ? this.getUrl : `${this.getUrl}?_token=${token}`

      response = await axios.get(url, config)
    } catch (error) {
      spinner.fail(chalk.bold.red(`Can't get list. Please, check your credentials. ${error}`));
    }

    return response
  }

  clear(data) {
    spinner.start(chalk.bold.green('Deleting all documents...'))

    const dataLength = data.length - 1

    data.forEach((item, index) => {
      this.delete(item.id, () => {
        if (index >= dataLength) {
          spinner.succeed(chalk.bold.green('Process complete! All documents have been deleted.'))
        }
      })
    })
  }

  delete(id, callback) {
    const config = {
      headers: {
        Accept: 'application/vnd.vtex.ds.v10+json',
        'Content-Type': 'application/json',
        'x-vtex-api-appKey': this.options.vtexAppKey,
        'x-vtex-api-appToken': this.options.vtexAppToken
      }
    }

    axios
      .delete(`${this.deleteUrl}/${id}`, config)
      .then(() => {
        callback()
      })
      .catch(error => {
        if (!spinner.enabled) {
          console.log(chalk.bold.red(`✖ ID: ${id} was not deleted. ${error}`))
        } else {
          spinner.stopAndPersist(
            {
              'text': chalk.bold.red(`ID: ${id} was not deleted. ${error}`),
              'symbol': chalk.bold.red('✖')
            }
          ).start()
        }
      })
  }

  async confirmDelete() {
    const question = [
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Do you really want to DELETE ALL DOCUMENTS?'
      }
    ]

    const answer = await inquirer.prompt(question)

    if (answer.confirm) {
      return true
    }

    return false
  }
}

const clear = new clearMD()
