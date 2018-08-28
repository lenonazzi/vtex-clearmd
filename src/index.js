const inquirer = require('inquirer')
const axios = require('axios')

class clearMD {
  constructor() {
    this.init()
  }

  async init() {
    const userData = await this.setup()

    this.options = userData

    this.getUrl = `https://api.vtexcrm.com.br/${this.options.store}/dataentities/${this.options.acronym}/search?_fields=${this.options.fields}`
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
        default: 'SL'
      },
      {
        name: 'fields',
        default: 'id,nome'
      },
      {
        name: 'vtexAppKey',
        default: 'my@email.com'
      },
      {
        type: 'password',
        name: 'vtexAppToken'
      }
    ]

    return inquirer.prompt(questions)
  }

  async start() {
    const data = await this.getData()

    await this.clear(data)
    this.confirmExit()
  }

  async getData() {
    const config = {
      headers: {
        Accept: 'application/vnd.vtex.ds.v10+json',
        'Content-Type': 'application/json',
        'REST-Range': 'resources=0-999'
      }
    }

    let response

    try {
      response = await axios.get(this.getUrl, config)
    } catch (error) {
      console.log('Can\'t get list.Please, check your credentials.')
      throw new Error(error)
    }

    return response.data
  }

  async clear(data) {
    await data.forEach(async item => {
      await this.delete(item.id)

      console.log(`Delete #${item.id}`)
      console.log(`Nome ${item.nome}`)
      console.log('-')
    })
  }

  async delete(id) {
    const config = {
      headers: {
        Accept: 'application/vnd.vtex.ds.v10+json',
        'Content-Type': 'application/json',
        'x-vtex-api-appKey': this.options.vtexAppKey,
        'x-vtex-api-appToken': this.options.vtexAppToken
      }
    }

    try {
      await axios.delete(`${this.deleteUrl}/${id}`, config)

      console.log('\n\n>>', `${this.deleteUrl}/${id}`)
    } catch (error) {
      throw new Error(error)
    }
  }

  async confirmExit() {
    const question = [
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Run script again with same data?'
      }
    ]

    const answer = await inquirer.prompt(question)

    if (answer.confirm) {
      this.start()
    }
  }
}

const clear = new clearMD()
