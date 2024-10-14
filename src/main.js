const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
        this.mode = null;
    }

    async start(msg) {
        this.mode = "main"
        const text = this.loadMessage("main")
        await this.sendImage("main")
        await this.sendText(text)

         await this.showMainMenu(            {
            "start": "Начать",
             "profile": "генерация Tinder-профиля 😎",
             "opener" : "сообщение для знакомства",
             "message" : "переписка от вашего имени",
            "date" : "переписка со звездами",
            "gpt": "задать вопрос чату GPT",
            "html": "Демонстрация HTML"
            }
        )
    }

    async html(msg) {
        await this.sendHTML('<h3>Привет! </h3>')
        const html = this.loadHtml("main")
        await this.sendHTML(html, {theme: "dark"})
    }
    async gpt(msg) {
        this.mode = "gpt"
        const text = this.loadMessage("gpt")
        await this.sendImage("gpt")
        await this.sendText(text)
    }

    async gptDialog(msg) {
        const text = msg.text;
        const answer = await chatgpt.sendQuestion("Ответь на вопрос", text)
        await this.sendText(answer)
    }

     async  hello(msg) {
        if(this.mode === "gpt")
        await this.gptDialog(msg);
        else {
        const text = msg.text;
        await this.sendText("<b>Привет!</b>")
         await this.sendText("<i>Как дела?</i>")
        await this.sendText(`Вы писали: ${text}`)

         await this.sendImage("avatar_main")

         await this.sendTextButtons("Какая у вас тема в Телеграм?", {
             "theme_light":"Светлая",
             "theme_dark":"Темная",
         })
            }
    }
   async helloButton(callbackQuery) {
        const query = callbackQuery.data;
        if (query === "theme_light")
        await this.sendText( "У вас светлая тема")
       else if (query === "theme_dark")
            await this.sendText( "У вас темная тема")
   }
}

const bot = new MyTelegramBot("7207101159:AAEj_ejzqcvhu1fqiz6iap4dlz1-lrEEwsU");

const chatgpt = new ChatGptService("gpt:ho7T8VOJeY6EVWR4okSxJFkblB3Tp7tf2SeYm4s7gNS3LPJN")
bot.onCommand( /\/start/, bot.start);
bot.onCommand( /\/html/, bot.html);
bot.onCommand( /\/gpt/, bot.gpt);
bot.onTextMessage(bot.hello);
bot.onButtonCallback( /^.*/ , bot.helloButton );