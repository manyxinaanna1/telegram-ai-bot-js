const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
        this.mode = null;
        this.list = []
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
        const myMessage = await this.sendText("Ваше сообщение было переслано ChatGPT... Ожидайте")
        const answer = await chatgpt.sendQuestion("Ответь на вопрос", text)
        await this.editText(myMessage, answer)
    }

    async date(msg) {
      this.mode = "date"
        const text = this.loadMessage("date")
        await this.sendImage("date")
        await this.sendTextButtons(text, {
            "date_grande": "Ариана Гранде",
            "date_robbie": "Марго Робби",
            "date_zendaya": "Зендея",
            "date_gosling": "Райн Гослинг",
            "date_hardy": "Том Харди",
        })
    }

    async dateButton(callbackQuery) {
        const query = callbackQuery.data;
        await this.sendImage(query)
        await this.sendText("Отличный выбор! Пригласи девушку/парня на свидание за 5 сообщений")
        const prompt = this.loadPrompt(query)
        chatgpt.setPrompt(prompt)
    }

    async dateDialog(msg) {
        const text = msg.text
        const myMessage = await this.sendText("Парень набирает текст")
        const answer = await chatgpt.addMessage(text)
       // await this.sendText(answer)
        await this.editText(myMessage, answer)
    }

    async message(msg) {
        this.mode = "message"
        const text = this.loadMessage("message")
        await this.sendImage("message")
        await this.sendTextButtons(text, {
            "message_next": "Следующее сообщение",
            "message_date": "Пригласить на свидание",
        })
    }

    async messageButton(callbackQuery) {
        const query =callbackQuery.data;
        const prompt = this.loadPrompt(query)
        const userChatHistory = this.list.join("\n\n")
        const myMessage = await this.sendText("ChatGPT думает над вариантами ответа...")
        const answer = await chatgpt.sendQuestion(prompt, userChatHistory)
        await this.editText(myMessage, answer)
    }

    async messageDialog(msg) {
        const text = msg.text
        this.list.push(text)
    }

     async  hello(msg) {
        if(this.mode === "gpt")
        await this.gptDialog(msg);
         else if(this.mode === "date")
             await this.dateDialog(msg)
        else if(this.mode === "message")
            await this.messageDialog(msg)
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
bot.onCommand( /\/date/, bot.date);
bot.onCommand( /\/message/, bot.message);
bot.onTextMessage(bot.hello);
bot.onButtonCallback(/^date_.*/ , bot.dateButton);
bot.onButtonCallback(/^message_.*/ , bot.messageButton);
bot.onButtonCallback( /^.*/ , bot.helloButton);